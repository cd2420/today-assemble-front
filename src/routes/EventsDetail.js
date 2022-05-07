
import { Button, ButtonGroup, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { LOCAL_STORAGE_CONST } from "../common/GlobalConst";
import { RESPONSE_STATUS } from "../common/ResponseStatus";
import { createEventMainImage, createEventSubImage, getLocalStorageData } from "../common/Utils";
import DaumMap from "../component/DaumMap";
import MainFeaturedPost from "../component/image/MainFeaturedPost";
import API from "../config/customAxios";
import _ from 'lodash';
import SubImagesArea from "../component/image/SubImagesArea";
import PopUpPage from "../component/popup/PopUpPage";

const EventsDetail = ({accounts}) => {
    
    const params = useParams();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);

    const [event, setEvent] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [address, setAddress] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [isParticipate, setIsParticipate] = useState(false);
    const [isLikes, setIsLikes] = useState(false);
    
    useEffect(() => {
        if (event == null) {
            if (params.events_id) {
                getEvent(params.events_id)
            }
        } else {
            settingImageAndAddress(event);
            if (accounts) {
                checkThisEventWithAccount(event, accounts);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [event])

    const getEvent = async (eventId) => {
        try {
            const {data, status}  = await API.get(`/api/v1/events/${eventId}`);
            if (status === RESPONSE_STATUS.OK) {
                if (data) {
                    setEvent(data);
                }
            }
            
        } catch(e) {
            console.log(e);
            navigate(-1);
        }

    }

    const settingImageAndAddress = (data) => {
        createEventMainImage(data);
        createEventSubImage(data);
        const {address, longitude, latitude} = data;
        setAddress({
            address
            , longitude
            , latitude
        });
    }

    const checkThisEventWithAccount = async (event_data, accounts) => {

        if (event_data.hostAccountsId === accounts.id) {
            setIsHost(true);
        }

        let {_jwt, is_ok} = getLocalStorageData();

        try {
            
            if (_jwt && is_ok) {
                const result1  = await API.get(`/api/v1/accounts/events/${event_data.id}`, {
                    headers : {
                        'Authorization': _jwt
                    }
                })

                if (result1.data && result1.status === RESPONSE_STATUS.OK) {
                    setIsParticipate(true);
                } else {
                    setIsParticipate(false);
                }

                const result2  = await API.get(`/api/v1/accounts/likes/${event_data.id}`, {
                    headers : {
                        'Authorization': _jwt
                    }
                })

                if (result2.data && result2.status === RESPONSE_STATUS.OK) {
                    setIsLikes(true);
                } else {
                    setIsLikes(false);
                }
            }
            
        } catch(e) {
            console.log(e);
            navigate(-1);
        }
    }

    // subImage 추가 함수
    const upload = async (imageList, addUpdateIndex) => {
        const req = {
            id: event.id
            , accountsId: event.hostAccountsId
            , images : _.cloneDeep(event.eventsImagesDtos)
        }
        
        if (imageList.length > 0) {
            imageList.forEach(element => {
                req.images.push({
                    imagesType : 'SUB'
                    , image : element.data_url
                })
            });
            const jwt = localStorage.getItem(LOCAL_STORAGE_CONST.ACCESS_TOKEN);
            try {
                const {data, status} = await API.put(`/api/v1/events/images`
                                                , JSON.stringify(req)
                                                , {
                                                    headers : {
                                                        'Authorization': jwt
                                                    }
                                                });
                if (status === RESPONSE_STATUS.OK) {
                    setEvent(data);
                }

            } catch (e) {
                console.log(e);
            }
        }
    }

    // subImage 삭제 함수
    const removeEventsSubImg = async (e) => {
        const {target: {value}} = e;
        event.subImage.splice(value, 1);

        const req = {
            id: event.id
            , accountsId: event.accountsId
            , images: []
        }
        if (event.subImage) {
            req.images = req.images.concat(event.subImage.map(img => ({imagesType:'SUB', image:img.image})));
        }
        
        const checkMainImg = event.eventsImagesDtos.filter(img => {return img.imagesType === 'MAIN'});
        if (checkMainImg.length > 0) {
            req.images.push(checkMainImg[0]);
        }
        
        const jwt = localStorage.getItem(LOCAL_STORAGE_CONST.ACCESS_TOKEN);
        try {
            if (jwt) {
                const {data, status}  = await API.put(
                                `/api/v1/events/images`
                                , JSON.stringify(req)
                                , {
                                    headers : {
                                        'Authorization': jwt
                                    }
                                });
                if (status === RESPONSE_STATUS.OK) {
                    setEvent(data);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    const showEndTime = () => {
        const end = new Date(moment(event.eventsTime).format('YYYY-MM-DD HH:mm'));
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
                    setEvent(data);
                }
            }
        } catch (e) {
            console.log(e);
        }
        
    }

    const participateEventsManage = async (e) => {
        e.preventDefault();
        const currentTarget = e.currentTarget;
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
                    setEvent(data.returnDto);
                }
            }
        } catch (e) {
            console.log(e);
            const errorStatus = e.response.status;
            if (errorStatus === RESPONSE_STATUS.FORBIDDEN) {
                setAnchorEl(currentTarget);
            } 
        }
    }

    const handleClickOpen = (e) => {
        e.preventDefault();
        setDialogOpen(true);
    }

    const handleClose = (e) => {
        e.preventDefault();
        setDialogOpen(false);
    }

    const removeEvents = async (e) => {
        await participateEventsManage(e);
        navigate('/home');
    }
    return (

            <>
            {
                event &&
                (   
                    <Container component="main" >
                        {
                            event.mainImage
                            &&
                            <MainFeaturedPost post={event} />
                        }
                        {
                            event.subImage
                            &&
                            <SubImagesArea event={event} isHost={isHost} upload={upload} removeEventsSubImg={removeEventsSubImg}/>
                        }
                        
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
                                {
                                    address
                                    &&
                                    <>
                                        <Typography>
                                        주소: {address.address}
                                        </Typography>
                                        <DaumMap address={address}/>
                                    </>
                                }
                            </Grid>
                            <Grid item xs={4}>
                                <Typography>
                                    태그
                                </Typography>
                                <div>
                                    {event.tagsDtos.map((tag, idx) => (
                                        <Button 
                                            variant="outlined" 
                                            key={idx}
                                            sx={{ m: 0.5 }}
                                            style={{
                                                borderRadius: 20
                                            }}
                                        >
                                        #{tag.name}
                                        </Button>
                                    ))}
                                </div>
                            </Grid>
                        </Grid>
                        
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography component="h1" variant="h5">
                                참여 유저
                            </Typography>
                            <Grid>
                                {
                                    event.accountsDtos.map((user, idx) => (
                                        <Button 
                                            key={idx}
                                            variant="outlined"
                                            sx={{
                                                m: 1
                                                }}
                                        >
                                            {user.name}
                                        </Button>
                                    ))
                                }  
                            </Grid>       
                        </Box>
                        {
                            localStorage.getItem(LOCAL_STORAGE_CONST.ACCESS_TOKEN)
                            &&
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
                                        variant={isLikes ? "contained" : "outlined"}
                                        onClick={likes}
                                    >
                                        좋아요 ({event.likesAccountsDtos ? event.likesAccountsDtos.length : 0 })
                                    </Button>
                                    <Button 
                                        key="2" 
                                        variant={isParticipate ? "contained" : "outlined"}
                                        color={isParticipate ? "error" : "primary"}
                                        name="deleteBtn"
                                        onClick={isHost ? handleClickOpen : participateEventsManage}
                                        disabled = {!isParticipate && event.nowMembers >= event.maxMembers}
                                    >
                                        { isHost ? "모임삭제" : (isParticipate ? "참가취소" : "모임참가")}
                                    </Button>
                                    {
                                        anchorEl &&
                                        <PopUpPage anchorEl={anchorEl} setAnchorEl={setAnchorEl}/>
                                    }
                                    
                                    <Dialog onClose={handleClose} open={dialogOpen}>
                                        <DialogTitle onClose={handleClose}>
                                            모임 삭제
                                        </DialogTitle>
                                        <DialogContent>
                                            <Typography gutterBottom>
                                                정말로 모임을 삭제 하시겠습니까?
                                            </Typography>
                                        </DialogContent>

                                        <DialogActions>
                                            <Button variant="contained" color="error" onClick={removeEvents}>삭제</Button>
                                            <Button variant="contained" color="primary" onClick={handleClose}>닫기</Button>
                                        </DialogActions>
                                    </Dialog>

                                    {
                                        isHost 
                                        && 
                                        <Button
                                            key="3" 
                                            variant="outlined"
                                            onClick={() => {navigate(`/events/update/${event.id}`)}}
                                        >
                                            수정
                                        </Button>

                                    }
                                    
                                </ButtonGroup>
                            </Box>
                        }
                    </Container>
                )
            }
            </>

    )
}

export default EventsDetail;