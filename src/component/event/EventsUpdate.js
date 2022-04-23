import React, {useState, useEffect} from "react";
import API from "../../config/customAxios";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {RESPONSE_STATUS} from "../../common/ResponseStatus";
import FormHelperText from '@mui/material/FormHelperText';
import {ERROR_CODE} from "../../common/GlobalConst";
import { DateTimePicker, LoadingButton, LocalizationProvider } from "@mui/lab";
import {  FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {useNavigate} from "react-router-dom";
import MainImageUpload from "../pagitaion/MainImageUpload";
import DaumMap from "../DaumMap";
import TakeTime from "../date/TakeTime";
import TagsComponent from "../TagsComponent";
import { adjustTimeZone } from "../../common/Utils";



const EventsUpdate = ({events, jwt}) => {

    const navigate = useNavigate();

    const getMainImg = (data) => {
        const check_main = data.filter(d => d.imagesType === 'MAIN');
        if (!data ||  check_main.length === 0 || check_main[0].image === '') {
            return []
        } else {
           return data.filter(d => d.imagesType === 'MAIN').map(d => ({'data_url': d.image}))
        }
    }

    const [mainImg, setMainImg] = useState(getMainImg(events.eventsImagesDtos));
    const [eventName, setEventName] = useState(events.name);
    const [description, setDescription] = useState(events.description);
    const [tags, setTags] = useState(events.tagsDtos.map(tag => (tag.name)));
    const [maxMembers, setMaxMembers] = useState(events.maxMembers);
    const [eventsType, setEventsType] = useState(events.eventsType);

    const [eventsTime, setEventsTime] = useState(new Date(events.eventsTime));
    const [eventsTimeError, setEventsTimeError] = useState(false);
    const [eventsTimeErrorText, setEventsTimeErrorText] = useState('');


    const [takeTime, setTakeTime] = useState(events.takeTime);
    const [_address, setAddress] = useState({
        address: events.address
        , longitude: events.longitude
        , latitude: events.latitude
    });
    const [createButton, setCreateButton] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
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

    const mainImgUpload = (imageList, addUpdateIndex) => {
        setMainImg(imageList);
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
        const req = makeReq();

        try {
            setIsLoading(true);
            const {data, status} = await API.put(
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
            id: events.id
            , accountsId: events.accountsId
            , name: eventName
            , description
            , maxMembers
            , eventsType
            , eventsTime
            , takeTime
            , address
            , longitude
            , latitude
            , tags
        }
        // JSON.stringfy 할때 timeZone에 의해 시간이 바뀌는 현상 수정
        adjustTimeZone(result.eventsTime);

        if (mainImg.length > 0) {
            const image = mainImg[0].data_url;
            result.images = events.eventsImagesDtos.concat([{
                imagesType: 'MAIN'
                , image
            }]);
        } else {
            result.images = events.eventsImagesDtos.filter(image => {return image.imagesType === 'SUB'})
        }


        return result;

    }


    return (

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
                    모임수정
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        {
                            mainImg
                            &&
                            (
                                <Grid item xs={12}>
                                    <MainImageUpload upload={mainImgUpload} profileImg={mainImg}/>            
                                </Grid>
                            )
                        }
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
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                id="description"
                                label="모임 설명"
                                name="description"
                                autoComplete="description"
                                value={description}
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TagsComponent setTags={setTags} defaultValue={tags}/>
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
                                    minDateTime = {new Date()}
                                />
                            </LocalizationProvider>
                            <FormHelperText error={eventsTimeError}>{eventsTimeErrorText}</FormHelperText>
                        </Grid>
                        <Grid item xs={12}>
                            <TakeTime 
                                onChange={onChange}
                                value={takeTime}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            모임 장소
                            <DaumMap onChange={onChange} address={_address} isCUPage={true}/>
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
                        모임 수정
                    </LoadingButton>
                </Box>
            </Box>
        </Container>

        
    );
}

export default EventsUpdate;