import { ThemeProvider } from "@emotion/react";
import { CardMedia, Container, createTheme, CssBaseline, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import HEADER_SECTION from "../common/HeaderSection";
import { createMainImage } from "../common/Utils";
import Header from "../component/Header";
import MainFeaturedPost from "../component/MainFeaturedPost";
import API from "../config/customAxios";


const EventsDetail = () => {
    const params = useParams();
    const [event, setEvent] = useState(null);
    useEffect(() => {
        
        const getEvent = async (eventId) => {
            try {
                const {data}  = await API.get(`/api/v1/events/${eventId}`);
                if (data) {
                    createMainImage(data);
                    data.subImage = data.eventsImagesDtos.filter((post) => {
                        return post.imagesType === 'MAIN';
                    })
                    setEvent(data);
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
                                {/* <Grid container spacing={4}>
                                </Grid> */}
                                <Box style={{maxHeight: '100vh', overflow: 'auto'}} overflow-x>
                                    {event.subImage.map(subImage => (
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 160, display: { xs: 'inline' } }}
                                            image={subImage.image}
                                        />
                                        ))
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