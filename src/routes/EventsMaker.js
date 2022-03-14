import React, {useState, useEffect} from "react";
import API from "../config/customAxios";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {RESPONSE_STATUS} from "../common/ResponseStatus";
import FormHelperText from '@mui/material/FormHelperText';
import {ERROR_CODE} from "../common/GlobalConst";
import { getLocalStorageData } from "../common/Utils";
import { DateTimePicker, LoadingButton, LocalizationProvider } from "@mui/lab";
import { createTheme, CssBaseline, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, ThemeProvider } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {useNavigate} from "react-router-dom";
import Header from "../component/Header";
import HEADER_SECTION from "../common/HeaderSection";
import MainImageUpload from "../component/MainImageUpload";
import DaumMap from "../component/DaumMap";
import TakeTime from "../component/TakeTime";



const EventsMaker = () => {

    const navigate = useNavigate();
    const [jwt, setJwt] = useState('')

    const [profileImg, setProfileImg] = useState([]);
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [maxMembers, setMaxMembers] = useState(1);
    const [eventsType, setEventsType] = useState('OFFLINE');

    const [eventsTime, setEventsTime] = useState(new Date());
    const [eventsTimeError, setEventsTimeError] = useState(false);
    const [eventsTimeErrorText, setEventsTimeErrorText] = useState('');


    const [takeTime, setTakeTime] = useState(1);
    const [_address, setAddress] = useState({});
    const [createButton, setCreateButton] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const {_jwt, is_ok} = getLocalStorageData();
        if (_jwt && is_ok) {
            setJwt(_jwt);
        } else {
            window.location.href ='/login';
        }
        validate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventName, _address])

    const validate = () => {
        if (eventName 
            && Object.keys(_address).length
            ) {
                setCreateButton(false)
        } else {
            setCreateButton(true)
        }

    }

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
            validateMaxMembers(value)
        } else if(name === "eventsType") {
            setEventsType(value);
        } else if(name === "date") {
            setEventsTime(value);
        } else if(name === "takeTime") {
            setTakeTime(value);
        } else if(name === "address") {
            setAddress(value);
        }
    }

    const validateMaxMembers = (value) => {
        if (value <= 0) {
            setMaxMembers(1);
        } else if (value > 50) {
            setMaxMembers(50);
        } else {
            setMaxMembers(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const req = makeReq();
        
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
                navigate(`/events/${data.id}`);
            }

        } catch(e) {
            const {errorCode, msg} = e.response.data;
            console.log(errorCode, msg);
            if (errorCode === ERROR_CODE.DATE_OVERLAP) {
                setEventsTimeError(true)
                setEventsTimeErrorText(msg)
            }
            setIsLoading(false);
        }
    }

    const makeReq = () => {
        const {address, longitude, latitude} = _address;
        let result = {
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
        result.eventsImagesSet = [{
            imagesType: 'MAIN'
            , image
        }]

        return result;

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
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DateTimePicker
                                            renderInput={(props) => <TextField {...props} />}
                                            label="모임 시간"
                                            value={eventsTime}
                                            onChange={(newValue) => {
                                                setEventsTime(newValue);
                                                setEventsTimeError(false)
                                                setEventsTimeErrorText('')
                                            }}
                                        />
                                    </LocalizationProvider>
                                    <FormHelperText error={eventsTimeError}>{eventsTimeErrorText}</FormHelperText>
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
                                disabled={createButton}
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

export default EventsMaker;