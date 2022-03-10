import { LoadingButton } from '@mui/lab';
import { Button, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import React, {useState, useEffect} from 'react';
import { LOCAL_STORAGE_CONST } from '../common/GlobalConst';
import { RESPONSE_STATUS } from '../common/ResponseStatus';
import { getAge, validateUserName } from '../common/Utils';
import API from '../config/customAxios';
import DateComponent from './DateComponent';
import MainImageUpload from './MainImageUpload';

const Profile = ({accounts, jwt}) => {

    const [profileImg, setProfileImg] = useState([]);

    const [userName, setUserName] = useState(accounts.name);
    const [userNameError, setUserNameError] = useState(false);
    const [userNameErrorText, setUserNameErrorText] = useState('');

    const [gender, setGender] = useState(accounts.gender);
    const [birth, setBirth] = useState(new Date(accounts.birth));

    const [updateButton, setUpdateButton] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        if (accounts.accountsImagesDto.image) {
            setProfileImg([{
                data_url : accounts.accountsImagesDto.image
            }])
        } 

    }, [])

    const upload = (imageList, addUpdateIndex) => {
        setProfileImg(imageList);
    }

    const onChange = (event) => {
        
        const {target: {name, value}} = event;
        if(name ==="userName") {
            setUserName(value);
            validateUserName(value, setUserNameError, setUserNameErrorText, setUpdateButton);
        } else if(name ==="gender") {
            setGender(value);
        } else if(name ==="date") {
            setBirth(value);
        }
    };

    const updateAccounts = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        accounts.name = userName;
        accounts.gender = gender;
        accounts.birth = birth;
        accounts.age = getAge(accounts.birth);

        let image = '';
        if (profileImg.length > 0) {
            image = profileImg[0].data_url;
        }
        accounts.accountsImagesDto = {
            imagesType: 'MAIN'
            , image
        }

        try {
            const {data, status, headers} = await API.put(
                `/api/v1/accounts/${accounts.id}`
                , JSON.stringify(accounts)
                , {
                    headers : {
                        'Authorization': jwt
                    }
                }
            )

            if (status === RESPONSE_STATUS.OK) {
                localStorage.setItem(LOCAL_STORAGE_CONST.ACCOUNTS, JSON.stringify(data));
                window.location.replace("/setting")
            }
        } catch (e) {
            const {errorCode, msg} = e.response.data
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <MainImageUpload upload={upload} profileImg={profileImg}/>            
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    value={ accounts.email}
                    disabled
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    autoComplete="userName"
                    name="userName"
                    required
                    fullWidth
                    id="userName"
                    label="이름"
                    value={userName}
                    onChange={onChange}
                    error={userNameError}
                    helperText={userNameErrorText}
                />
            </Grid>
            <Grid item xs={12}>
                <FormControl
                    required
                    onChange={onChange}
                >
                    <FormLabel id="gender-label">성별</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="gender-label"
                        name="gender"
                        defaultValue = {accounts.gender}
                    >
                        <FormControlLabel value="FEMALE" control={<Radio />} label="여성" />
                        <FormControlLabel value="MALE" control={<Radio />} label="남성" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <Typography
                    component="h6"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1 }}
                >
                    생년월일
                </Typography>
                <DateComponent 
                    onChange={onChange} 
                    birth = {birth}
                />
            </Grid>
            <LoadingButton
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={updateAccounts}
                disabled={updateButton}
                loading={isLoading}
            >
                수정
            </LoadingButton>
        </Grid>
    )
}

export default Profile;