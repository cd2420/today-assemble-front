import React, {useState, useEffect} from "react";
import API from "../config/customAxios";
import { Avatar, Box, Container, createTheme, CssBaseline, FormControl, FormControlLabel, FormLabel, Grid, Link, Radio, RadioGroup, TextField, ThemeProvider, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Header from "../component/Header";
import HEADER_SECTION from "../common/HeaderSection";
import {ERROR_CODE, LOCAL_STORAGE_CONST} from "../common/GlobalConst";
import DateComponent from "../component/DateComponent";
import {RESPONSE_STATUS} from "../common/ResponseStatus";
import { getAge, getLocalStorageData, validatePassword, validateUserName } from "../common/Utils";
import { LoadingButton } from "@mui/lab";


const SignUp = () => {

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorText, setEmailErrorText] = useState('');

    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorText, setPasswordErrorText] = useState('');

    const [userName, setUserName] = useState('');
    const [userNameError, setUserNameError] = useState(false);
    const [userNameErrorText, setUserNameErrorText] = useState('');

    const [gender, setGender] = useState('');
    const [birth, setBirth] = useState(new Date());

    const [signUpButton, setSignUpButton] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const {is_ok} = getLocalStorageData();
        if (is_ok) {
            window.history.back()
        }
        validate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email, password, passwordCheck, userName, gender, birth])

    const validate = () => {
        if (email 
            && password 
            && passwordCheck 
            && userName 
            && gender
            && birth
            && !emailError
            && !passwordError
            && !userNameError
            ) {
                setSignUpButton(false)
        } else {
            setSignUpButton(true)
        }
    }

    const onChange = (event) => {
        
        const {target: {name,value}} = event;
        if(name === "email") {
            setEmail(value);
        } else if(name ==="password") {
            setPassword(value);
        } else if(name ==="password-check") {
            setPasswordCheck(value);
        } else if(name ==="userName") {
            setUserName(value);
        } else if(name ==="gender") {
            setGender(value);
        } else if(name ==="birth") {
            setBirth(value);
        }
        validateProps(name,value)
        
    };

    const validateProps = (name,value) => {
        if(name === "email") {
            validateEmail(value)
        } else if(name ==="password") {
            validatePassword(value, passwordCheck, setPasswordError, setPasswordErrorText, (check) => {})
        } else if(name ==="password-check") {
            validatePassword(value, password, setPasswordError, setPasswordErrorText, (check) => {})
        } else if(name ==="userName") {
            validateUserName(value, setUserNameError, setUserNameErrorText, (check) => {});
        }
    };

    const validateEmail = (val) => {
        const regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

        setEmailError(false)
        setEmailErrorText('')
        if (val === '') {
            return
        }

        if (!regEmail.test(val)) {
            setEmailError(true)
            setEmailErrorText('잘못된 이메일 형식입니다.')
            return 
        }
        
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true)
        try {
            const accounts = getAccounts()
            const {data, status, headers} = await API.post("/api/v1/accounts/sign-up", JSON.stringify(accounts))
            if (status === RESPONSE_STATUS.OK) {
                localStorage.setItem(LOCAL_STORAGE_CONST.ACCOUNTS, JSON.stringify(data));
                localStorage.setItem(LOCAL_STORAGE_CONST.ACCESS_TOKEN, headers.authorization);
                window.location.href = '/home';
            }
        } catch (e) {
            const {errorCode, msg} = e.response.data
            if (errorCode === ERROR_CODE.ALREADY_EXISTS_USER) {
                setEmailError(true)
                setEmailErrorText(msg)
            }
        }
        setIsLoading(false)
    };

    const getAccounts = () => {
        const age = getAge(birth)
        const accounts = {
            email
            , password
            , name: userName
            , gender
            , birth
            , age
        };
        return accounts
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
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        autoFocus
                                        id="email"
                                        label="Email"
                                        name="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={onChange}
                                        error={emailError}
                                        helperText={emailErrorText}
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
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="비밀번호"
                                        type="password"
                                        id="password"
                                        autoComplete="password"
                                        value={password}
                                        onChange={onChange}
                                        error={passwordError}
                                        helperText={passwordErrorText}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password-check"
                                        label="비밀번호 확인"
                                        type="password"
                                        id="password-check"
                                        autoComplete="password-check"
                                        value={passwordCheck}
                                        onChange={onChange}
                                        error={passwordError}
                                        helperText={passwordErrorText}
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
                                        >
                                            <FormControlLabel value="FEMALE" control={<Radio />} label="여성" />
                                            <FormControlLabel value="MALE" control={<Radio />} label="남성" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <DateComponent onChange={onChange} />
                                </Grid>
                            </Grid>
                            <LoadingButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleSubmit}
                                disabled={signUpButton}
                                loading={isLoading}
                            >
                                회원가입
                            </LoadingButton>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/login" variant="body2">
                                        로그인
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </Container>
        </ThemeProvider>

    );

}

export default SignUp;