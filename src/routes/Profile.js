import React, {useState, useEffect} from "react";
import API from "../config/customAxios";
import HEADER_SECTION from "../common/HeaderSection";
import Header from "../component/Header";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getAge, getLocalStorageData } from "../common/Utils";
import { Box, Button, ButtonGroup, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import DateComponent from "../component/DateComponent";
import ImageUploading from "react-images-uploading";
import { LoadingButton } from "@mui/lab";
import { RESPONSE_STATUS } from "../common/ResponseStatus";
import { LOCAL_STORAGE_CONST } from "../common/GlobalConst";

const Profile = () => {

    const [accounts, setAccounts] = useState(null);
    const [jwt, setJwt] = useState('');
    const [accountsPage, setAccountsPage] = useState(true);
    let [profileImg, setProfileImg] = useState([]);

    const [userName, setUserName] = useState('');
    const [userNameError, setUserNameError] = useState(false);
    const [userNameErrorText, setUserNameErrorText] = useState('');

    const [gender, setGender] = useState('');
    const [birth, setBirth] = useState(new Date());

    const [updateButton, setUpdateButton] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [myEventsPage, setMyEventsPage] = useState(false);
    const [myLikesPage, setMyLikesPage] = useState(false);

    const buttons = [
        <Button key="1">내 계정</Button>,
        <Button key="2">비밀번호 변경</Button>,
        <Button key="3">내 모임</Button>,
        <Button key="4">관심 모임</Button>,
      ];

    useEffect(() => {
        const {_accounts, _jwt, is_ok } = getLocalStorageData()
        if (is_ok) {
            setJwt(_jwt)
            const tmp_accounts = JSON.parse(_accounts)
            tmp_accounts.birth = new Date(tmp_accounts.birth)
            setAccounts(tmp_accounts)
            setUserName(tmp_accounts.name)
            setGender(tmp_accounts.gender)
            setBirth(tmp_accounts.birth)
            if (tmp_accounts.accountsImagesDto.image) {
                setProfileImg([{
                    data_url : tmp_accounts.accountsImagesDto.image
                }])
            } 
        } else {
            window.location.href='/login'
        }
    }, [])

    const upload = (imageList, addUpdateIndex) => {
        console.log(imageList[0])
        setProfileImg(imageList);
    }

    const onChange = (event) => {
        
        const {target: {name, value}} = event;
        if(name ==="userName") {
            setUserName(value);
            validateUserName(value);
        } else if(name ==="gender") {
            setGender(value);
        } else if(name ==="birth") {
            setBirth(value);
        }
    };

    const validateUserName = (val) => {
        const regUserName = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{0,10}$/

        setUserNameError(false)
        setUserNameErrorText('')

        if (val === '') {
            setUpdateButton(true)
            return
        }

        if (val.length < 3 || val.length > 10) {
            setUserNameError(true)
            setUserNameErrorText('이름은 최소 3, 최대 10자리')
            setUpdateButton(true)
            return 
        }

        if (!regUserName.test(val)) {
            setUserNameError(true)
            setUserNameErrorText('잘못된 이름 형식입니다.')
            setUpdateButton(true)
            return 
        }
        setUpdateButton(false)
    }

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
                window.location.replace("/profile")
            }
        } catch (e) {
            const {errorCode, msg} = e.response.data
        } finally {
            setIsLoading(false)
        }
    }

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Header title={HEADER_SECTION.title} sections={HEADER_SECTION.sections} />
                <Container component="main" >
                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    '& > *': {
                                    m: 1,
                                    },
                                }}
                            >
                                <ButtonGroup
                                    orientation="vertical"
                                    aria-label="vertical outlined button group"
                                >
                                {buttons}
                                </ButtonGroup>
                            </Box>
                        </Grid>
                        <Grid item xs={9}>
                            {
                                accounts && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            
                                            <ImageUploading
                                                multiple
                                                value={profileImg}
                                                onChange={upload}
                                                maxNumber={1}
                                                dataURLKey="data_url"
                                            >
                                                {({
                                                    imageList,
                                                    onImageUpload,
                                                    onImageRemoveAll,
                                                    onImageUpdate,
                                                    onImageRemove,
                                                    isDragging,
                                                    dragProps
                                                    }) => (
                                                    // write your building UI
                                                    <div className="upload__image-wrapper">
                                                        <Button
                                                            variant="outlined"
                                                            style={isDragging ? { color: "red" } : null}
                                                            onClick={onImageUpload}
                                                            {...dragProps}
                                                            disabled={imageList[0]}
                                                        >
                                                            이미지 업로드
                                                        </Button>
                                                        &nbsp;
                                                        {imageList.map((image, index) => (
                                                            <div key={index} className="image-item">
                                                                <img src={image.data_url} alt="" width="250" />
                                                                <div className="image-item__btn-wrapper">
                                                                    <Button onClick={() => onImageUpdate(index)} variant="outlined">이미지 교체</Button>
                                                                    <Button onClick={() => onImageRemove(index)} variant="outlined">이미지 제거</Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </ImageUploading>
                                            
                                            
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
                        </Grid>
                    </Grid>
                </Container>
            </Container>
        </ThemeProvider>

    );

}

export default Profile;