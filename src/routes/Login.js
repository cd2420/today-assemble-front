import React, {useState, useEffect} from "react";
import API from "../config/customAxios";
import HEADER_SECTION from "../common/HeaderSection";
import Header from "../component/Header";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
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



const Login = () => {

    const [formLogin, setFormLogin] = useState(true);

    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const {is_ok} = getLocalStorageData();
        if (is_ok) {
            window.history.back()
        }
    }, [])

    const changeLoginType = () => {
        setFormLogin(!formLogin)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
       
        try {
            const formData = new FormData(event.currentTarget);
            const accounts = {
              email: formData.get('email'),
              password: formData.get('password')
            };
            let url = "/login"
            if (!formLogin) {
                url = "/api/v1/accounts" + url
            }
            const {headers, status} = await API.post(url, JSON.stringify(accounts))

            if (formLogin) {
                if (status === RESPONSE_STATUS.OK) {
                    const {data, status} = await getAccountsDataByJwt(headers.authorization)
                    if (status === RESPONSE_STATUS.OK) {
                        localStorage.setItem(LOCAL_STORAGE_CONST.ACCESS_TOKEN, headers.authorization);
                        localStorage.setItem(LOCAL_STORAGE_CONST.ACCOUNTS, JSON.stringify(data));
                        window.history.back();
                    }
                }
            } else {
                setError(true)
                setErrorMsg('이메일을 확인하세요.')
            }
        } catch (e) {
            setErrorMsg('아이디 혹은 비밀번호가 잘못되었습니다.');
            setError(true);
        }
    };

    const handleTextClick = () => {
        setErrorMsg('')
        setError(false)
    }

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Header title={HEADER_SECTION.title} sections={HEADER_SECTION.sections} />
                <main>
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
                            로그인
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} onClick={handleTextClick} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                disabled={!formLogin}
                            />
                            <FormHelperText error={error}>{errorMsg}</FormHelperText>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                로그인
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link onClick={changeLoginType} href='#' variant="body2">
                                        {formLogin ? '패스워드 없이 로그인' : '패스워드 로그인'}
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/signUp" variant="body2">
                                        회원가입
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </main>
            </Container>
        </ThemeProvider>

    );

}

export default Login;