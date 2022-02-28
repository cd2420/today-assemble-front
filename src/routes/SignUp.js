import React, {useState, useEffect} from "react";
import API from "../config/customAxios";
import { Avatar, Box, Button, Container, createTheme, CssBaseline, Grid, Link, TextField, ThemeProvider, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Header from "../component/Header";
import HEADER_SECTION from "../common/HeaderSection";
import GLOBAL_CONST from "../common/GlobalConst";


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
    const [genderError, setGenderError] = useState(false);
    const [genderErrorText, setGenderErrorText] = useState('');

    const [birth, setBirth] = useState('');
    const [birthError, setBirthError] = useState(false);
    const [birthErrorText, setBirthErrorText] = useState('');

    const [signUpButton, setSignUpButton] = useState(true);


    useEffect(() => {
        const jwt = localStorage.getItem(GLOBAL_CONST.ACCESS_TOKEN)
        if (jwt) {
            window.history.back()
        }
    }, [])

    const onchange = (event) => {
        
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
        validateProps(event)
        validate()
    };

    const validateProps = (event) => {
        const {target: {name,value}} = event;
        if(name === "email") {
            validateEmail(value)
        } else if(name ==="password") {
            validatePassword(name, value);
        } else if(name ==="password-check") {
            validatePassword(name, value);
        } else if(name ==="name") {
            
        } else if(name ==="gender") {
            setGender(value);
        } else if(name ==="birth") {
            setBirth(value);
        }
    };

    const validateEmail = (val) => {
        const regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

        if (val === '') {
            setEmailError(false)
            setEmailErrorText('')
            return
        }

        if (!regEmail.test(val)) {
            setEmailError(true)
            setEmailErrorText('잘못된 이메일 형식입니다.')
            return 
        }

        setEmailError(false)
        setEmailErrorText('')
        
    }

    const validatePassword = (type, val) => {
        
        if (val === '') {
            setPasswordError(false)
            setPasswordErrorText('')
            return
        }

        if (val.length < 6 || val.length > 20) {
            setPasswordError(true)
            setPasswordErrorText('비밀번호는 최소 6, 최대 20자리')
            return
        }

        if(type ==="password") {
            if (val !== passwordCheck) {
                setPasswordError(true)
                setPasswordErrorText('비밀번호가 일치하지 않습니다.')
                return
            }
        } else if(type ==="password-check") {
            if (val !== password) {
                setPasswordError(true)
                setPasswordErrorText('비밀번호가 일치하지 않습니다.')
                return
            }
        }

        setPasswordError(false)
        setPasswordErrorText('')
        
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
    };

    const validate = () => {
        // setSignUpButton(false)
    }

    const handleTextClick = () => {

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
                        onClick={handleTextClick}
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
                                        onChange={onchange}
                                        error={emailError}
                                        helperText={emailErrorText}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        autoComplete="name"
                                        name="name"
                                        required
                                        fullWidth
                                        id="name"
                                        label="이름"
                                        value={userName}
                                        onChange={onchange}
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
                                        onChange={onchange}
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
                                        onChange={onchange}
                                        error={passwordError}
                                        helperText={passwordErrorText}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleSubmit}
                                disabled={signUpButton}
                            >
                                회원가입
                            </Button>
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