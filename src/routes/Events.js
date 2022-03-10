import React, {useState, useEffect} from "react";
import API from "../config/customAxios";
import HEADER_SECTION from "../common/HeaderSection";
import Header from "../component/Header";
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {RESPONSE_STATUS} from "../common/ResponseStatus";
import FormHelperText from '@mui/material/FormHelperText';
import {LOCAL_STORAGE_CONST} from "../common/GlobalConst";
import { getLocalStorageData, getAccountsDataByJwt } from "../common/Utils";
import { DateTimePicker, LoadingButton, LocalizationProvider } from "@mui/lab";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import DateComponent from "../component/DateComponent";
import TakeTime from "../component/TakeTime";
import DaumMap from "../component/DaumMap";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import MainImageUpload from "../component/MainImageUpload";



const Events = () => {

    const [jwt, setJwt] = useState('')

    const [profileImg, setProfileImg] = useState([]);
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [maxMembers, setMaxMembers] = useState(1);
    const [eventsType, setEventsType] = useState('OFFLINE');
    const [eventsTime, setEventsTime] = useState(new Date());
    const [takeTime, setTakeTime] = useState(1);
    const [_address, setAddress] = useState({});

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const {_jwt, is_ok} = getLocalStorageData();
        if (_jwt && is_ok) {
            setJwt(_jwt);
        } else {
            window.location.href ='/login';
        }
    }, [])

    const upload = (imageList, addUpdateIndex) => {
        setProfileImg(imageList);
    }

    const onChange = (event) => {
        const {target: {name,value}} = event;
        if(name === "eventName") {
            setEventName(value);
        } else if(name === "description") {
            setDescription(value);
        } else if(name === "maxMembers") {
            setMaxMembers(value);
        } else if(name === "eventsType") {
            setEventsType(value);
        } else if(name === "date") {
            setEventsTime(value);
        } else if(name === "takeTime") {
            setTakeTime(value);
        } else if(name === "address") {
            setAddress(value)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const {address, longitude, latitude} = _address;
        const req = {
            name: eventName
            , description
            , maxMembers
            , eventsType
            , eventsTime
            , takeTime
            , address
            , longitude
            , latitude
        }
        let image = '';
        if (profileImg.length > 0) {
            image = profileImg[0].data_url;
        }
        req.eventsImagesSet = [{
            imagesType: 'MAIN'
            , image
        }]
        try {
            const {data, status} = await API.post(
                `/api/v1/events`
                , JSON.stringify(req)
                , {
                    headers : {
                        'Authorization': jwt
                    }
                }
            )
            if (status === RESPONSE_STATUS.OK) {
                console.log(data, status)
            }

        } catch(e) {
            const {errorCode, msg} = e.response.data;
            console.log(errorCode, msg);
        }
        
        
    }

    

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg">
                <CssBaseline />
                <Header title={HEADER_SECTION.title} sections={HEADER_SECTION.sections} />
                <Container component="main" maxWidth="xs">    
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            모임생성
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <MainImageUpload upload={upload} profileImg={profileImg}/>            
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        autoComplete="eventName"
                                        name="eventName"
                                        required
                                        fullWidth
                                        autoFocus
                                        id="eventName"
                                        label="모임 제목"
                                        value={eventName}
                                        onChange={onChange}
                                        // error={eventNameError}
                                        // helperText={eventNameErrorText}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="description"
                                        label="모임 설명"
                                        name="description"
                                        autoComplete="description"
                                        value={description}
                                        onChange={onChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="number"
                                        name="maxMembers"
                                        label="최대인원"
                                        id="maxMembers"
                                        autoComplete="maxMembers"
                                        value={maxMembers}
                                        onChange={onChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl 
                                        required
                                        onChange={onChange}
                                    >
                                        <FormLabel id="eventsType-label">모임 타입</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="eventsType-label"
                                            name="eventsType"
                                            value={eventsType}
                                        >
                                            <FormControlLabel value="ONLINE" control={<Radio />} label="온라인" />
                                            <FormControlLabel value="OFFLINE" control={<Radio />} label="오프라인" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    {/* <Typography
                                        component="h6"
                                        color="inherit"
                                        noWrap
                                        sx={{ flexGrow: 1 }}
                                    >
                                        모임 날짜
                                    </Typography>
                                    <DateComponent 
                                        onChange={onChange} 
                                    /> */}
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DateTimePicker
                                            renderInput={(props) => <TextField {...props} />}
                                            label="모임 시간"
                                            value={eventsTime}
                                            onChange={(newValue) => {
                                                setEventsTime(newValue);
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12}>
                                    <TakeTime 
                                        onChange={onChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    모임 장소
                                    <DaumMap onChange={onChange}/>
                                </Grid>
                            </Grid>
                            <LoadingButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleSubmit}
                                // disabled={createButton}
                                loading={isLoading}
                            >
                                모임 생성
                            </LoadingButton>
                        </Box>
                    </Box>
                </Container>
            </Container>
        </ThemeProvider>

    );

}

export default Events;