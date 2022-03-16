import { ThemeProvider } from "@emotion/react";
import { Button, CardMedia, Container, createTheme, CssBaseline, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { LOCAL_STORAGE_CONST } from "../common/GlobalConst";
import HEADER_SECTION from "../common/HeaderSection";
import { RESPONSE_STATUS } from "../common/ResponseStatus";
import { createMainImage } from "../common/Utils";
import Header from "../component/Header";
import MainFeaturedPost from "../component/MainFeaturedPost";
import API from "../config/customAxios";


const EventsDetail = () => {
    const params = useParams();
    const [event, setEvent] = useState(null);
    const [isHost, setIsHost] = useState(false);
    useEffect(() => {
        
        const getEvent = async (eventId) => {
            try {
                const {data}  = await API.get(`/api/v1/events/${eventId}`);
                const tmp_event = data;
                if (tmp_event) {
                    createMainImage(tmp_event);
                    tmp_event.subImage = data.eventsImagesDtos.filter((post) => {
                        return post.imagesType === '';
                    })
                    setEvent(tmp_event);

                    // 내가 만든 모임일 경우 사진 추가 버튼 보이게.
                    const jwt = localStorage.getItem(LOCAL_STORAGE_CONST.ACCESS_TOKEN);
                    if (jwt) {
                        const {data, status}  = await API.get(
                                        `/api/v1/accounts`
                                        , {
                                            headers : {
                                                'Authorization': jwt
                                            }
                                        });
                        if (status === RESPONSE_STATUS.OK) {
                            if (tmp_event.hostAccountsId === data.id) {
                                setIsHost(true);
                            }
                        }
                    }
                }
            } catch(e) {
                console.log(e);
            }

        }
        if (params.events_id) {
            getEvent(params.events_id)
        }
    }, [])
    const theme = createTheme();
    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg">
                <CssBaseline />
                <Header title={HEADER_SECTION.title} sections={HEADER_SECTION.sections} />
                
                    {
                        event &&
                        (   
                            <Container component="main" >
                                <MainFeaturedPost post={event} />
                                <Box
                                    mb={2}
                                    display="flex"
                                    flexDirection="row"
                                    style={{
                                        maxHeight: '100vh', // fixed the height
                                        overflow: "scroll",
                                        overflowY: "hidden" // added scroll
                                    }}
                                >
                                    {event.subImage.map(subImage => (
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 160, m: 1, display: { xs: 'inline' } }}
                                            image={subImage.image}
                                            style={{
                                                borderRadius: 2
                                            }}
                                        />
                                        ))
                                    }
                                    {
                                        isHost && 
                                        (
                                            <Button sx={{ width: 160, m:1, border: '1px dashed grey' }} >
                                                사진 추가
                                            </Button>
                                        )
                                    }
                                    
                                </Box>
                            </Container>
                        )
                    }
            </Container>
        </ThemeProvider>

    )
}

export default EventsDetail;