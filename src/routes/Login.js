import React, {useState, useEffect} from "react";
import API from "../config/customAxios";
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {RESPONSE_STATUS} from "../common/ResponseStatus";
import FormHelperText from '@mui/material/FormHelperText';
import {LOCAL_STORAGE_CONST} from "../common/GlobalConst";
import { getLocalStorageData } from "../common/Utils";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";



const Login = () => {
    const navigate = useNavigate();

    const [formLogin, setFormLogin] = useState(true);
    const [loginButton, setSignUpButton] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const {is_ok} = getLocalStorageData();
        if (is_ok) {
            navigate(-1);
        }
    }, [])

    const changeLoginType = () => {
        setFormLogin(!formLogin);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSignUpButton(true);
        setIsLoading(true);
        try {
            const formData = new FormData(event.currentTarget);
            const accounts = {
              email: formData.get('email'),
              password: formData.get('password')
            };
            let url = "/login";
            if (!formLogin) {
                url = "/api/v1/accounts" + url;
            }
            const {headers, status} = await API.post(url, JSON.stringify(accounts));

            if (formLogin) {
                if (status === RESPONSE_STATUS.OK) {
                    localStorage.setItem(LOCAL_STORAGE_CONST.ACCESS_TOKEN, headers.authorization);
                    navigate(-1);
                }
            } else {
                setError(true);
                setErrorMsg('이메일을 확인하세요.');
                setSignUpButton(false);
                setIsLoading(false);
            }
        } catch (e) {
            setErrorMsg('아이디 혹은 비밀번호가 잘못되었습니다.');
            setError(true);
            setSignUpButton(false);
            setIsLoading(false);
        }
    };

    const handleTextClick = () => {
        setErrorMsg('');
        setError(false);
    }

    return (

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
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
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
                        </Grid>
                        <Grid item xs={12}>
                        {
                            formLogin
                            && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    // disabled={!formLogin}
                                />

                            )
                        }
                        </Grid>
                        <Grid item xs={12}>
                            <FormHelperText error={error}>{errorMsg}</FormHelperText>
                            <LoadingButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loginButton}
                                loading={isLoading}
                            >
                                로그인
                            </LoadingButton>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container >
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
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </main>


    );

}

export default Login;