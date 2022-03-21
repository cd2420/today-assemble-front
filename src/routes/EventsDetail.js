import { ThemeProvider } from "@emotion/react";
import { Button, ButtonGroup, CardMedia, Container, createTheme, CssBaseline, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { LOCAL_STORAGE_CONST } from "../common/GlobalConst";
import HEADER_SECTION from "../common/HeaderSection";
import { RESPONSE_STATUS } from "../common/ResponseStatus";
import { createMainImage } from "../common/Utils";
import DaumMap from "../component/DaumMap";
import Header from "../component/Header";
import MainFeaturedPost from "../component/MainFeaturedPost";
import API from "../config/customAxios";


const EventsDetail = () => {
    const params = useParams();
    const [event, setEvent] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [address, setAddress] = useState({});
    useEffect(() => {
        
        if (params.events_id) {
            getEvent(params.events_id)
        }
    }, [])

    const getEvent = async (eventId) => {
        try {
            const {data, status}  = await API.get(`/api/v1/events/${eventId}`);
            if (status === RESPONSE_STATUS.OK) {
                if (data) {
                    settingImageAndAddress(data);
                    
                    // 내가 만든 모임일 경우 사진 추가 버튼 보이게.
                    // 내가 참여중인 모임인지 체크
                    // 내가 좋아요 누른 모임인지 체크
                    await checkThisEventWithAccount(data);
                    setEvent(data);
                }
            }
            
        } catch(e) {
            console.log(e);
            window.history.back();
        }

    }

    const settingImageAndAddress = (data) => {
        createMainImage(data);
        data.subImage = data.eventsImagesDtos.filter((post) => {
            return post.imagesType === 'SUB';
        })
        const {address, longitude, latitude} = data;
        setAddress({
            address
            , longitude
            , latitude
        });

    }

    const checkThisEventWithAccount = async (event_data) => {
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
                if (event_data.hostAccountsId === data.id) {
                    setIsHost(true);
                }

                if (data.likesDtos) {
                    if (data.likesDtos.filter(likesDto => likesDto.eventsDto.id === event_data.id).length > 0) {
                        event_data.isLikes = true;
                    }
                }

                if (data.eventsDtos) {
                    if (data.eventsDtos.filter(eventsDto => eventsDto.id === event_data.id).length  > 0) {
                        event_data.isParticipate = true;
                    }
                }
            }
        }

    }

    const showEndTime = () => {
        const end = new Date(moment(event.eventsTime).format('YYYY-MM-DD hh:mm'));
        end.setHours(end.getHours() + event.takeTime);
        return moment(end).format('YYYY-MM-DD HH시 mm분');
    }

    const likes = async (e) => {
        e.preventDefault();
        const jwt = localStorage.getItem(LOCAL_STORAGE_CONST.ACCESS_TOKEN);
        try {
            if (jwt) {
                const {data, status}  = await API.post(
                                `/api/v1/accounts/likes/events/${event.id}`
                                , JSON.stringify("") // 이거 없으면 서버에서 header값을 못받음... 그 이유는??
                                , {
                                    headers : {
                                        'Authorization': jwt
                                    }
                                });
                if (status === RESPONSE_STATUS.OK) {
                    settingImageAndAddress(data);
                    await checkThisEventWithAccount(data);
                    setEvent(data);
                }
            }
        } catch (e) {
            console.log(e);
        }
        
    }

    const participateEventsManage = async (e) => {
        e.preventDefault();
        // 호스트일경우 모임을 삭제할것인지 물어보기
        const jwt = localStorage.getItem(LOCAL_STORAGE_CONST.ACCESS_TOKEN);
        try {
            if (jwt) {
                const {data, status}  = await API.post(
                                `/api/v1/events/${event.id}/accounts`
                                , JSON.stringify("") // 이거 없으면 서버에서 header값을 못받음... 그 이유는??
                                , {
                                    headers : {
                                        'Authorization': jwt
                                    }
                                });
                if (status === RESPONSE_STATUS.OK) {
                    settingImageAndAddress(data.returnDto);
                    await checkThisEventWithAccount(data.returnDto);
                    setEvent(data.returnDto);
                }
            }
        } catch (e) {
            console.log(e);
        }
        
    }

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
                                <Grid container spacing={2} >
                                    <Grid 
                                        item
                                        xs={4}
                                    >
                                        <Typography>
                                            모임 일정
                                        </Typography>
                                        <Box 
                                           sx={{
                                            display: 'flex',
                                            alignItems: 'space-evenly',
                                            flexDirection: 'column',
                                            p: 1,
                                            m: 1
                                          }}
                                        >
                                            <Typography>
                                                시작 시간 : {moment(event.eventsTime).format('YYYY-MM-DD HH시 mm분')}
                                            </Typography>
                                            <Typography >
                                                종료 시간 : {showEndTime()}
                                            </Typography>
                                            <Typography >
                                                참여인원 : {event.nowMembers} / {event.maxMembers}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography>
                                            주소: {address.address}
                                        </Typography>
                                        <DaumMap address={address}/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography>
                                            태그
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    '& > *': {
                                    m: 3,
                                    },
                                }}
                                >
                                    <ButtonGroup 
                                        fullWidth
                                        variant="text" 
                                        aria-label="text button group"
                                    >
                                        <Button 
                                            key="1" 
                                            variant={event.isLikes ? "contained" : "outlined"}
                                            onClick={likes}
                                        >
                                            좋아요 ({event.likesAccountsDtos ? event.likesAccountsDtos.length : 0 })
                                        </Button>
                                        <Button 
                                            key="2" 
                                            variant={event.isParticipate ? "contained" : "outlined"}
                                            color={event.isParticipate ? "error" : "primary"}
                                            onClick={participateEventsManage}
                                            disabled = {!event.isParticipate && event.nowMembers >= event.maxMembers}
                                        >
                                            { isHost ? "모임삭제" : (event.isParticipate ? "참가취소" : "모임참가")}
                                        </Button>
                                        {
                                            isHost 
                                            && 
                                            <Button
                                                key="3" 
                                                variant="outlined" 
                                            >
                                                수정
                                            </Button>

                                        }
                                        
                                    </ButtonGroup>
                                </Box>
                            </Container>
                        )
                    }
            </Container>
        </ThemeProvider>
    )
}

export default EventsDetail;