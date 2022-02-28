import React, {useState, useEffect} from "react";
import API from "../config/customAxios";
import HEADER_SECTION from "../common/HeaderSection";
import Header from "../component/Header";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RESPONSE_STATUS from "../common/ResponseStatus";
import FormHelperText from '@mui/material/FormHelperText';
import GLOBAL_CONST from "../common/GlobalConst";



const Login = () => {

    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const jwt = localStorage.getItem(GLOBAL_CONST.ACCESS_TOKEN)
        if (jwt) {
            window.history.back()
        }
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
       
        try {
            const formData = new FormData(event.currentTarget);
            const accounts = {
              email: formData.get('email'),
              password: formData.get('password')
            };
            const {headers, status} = await API.post("/login", JSON.stringify(accounts))
            if (status === RESPONSE_STATUS.OK) {
                localStorage.setItem(GLOBAL_CONST.ACCESS_TOKEN, headers.authorization);
                window.history.back();
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
                            />
                            <FormHelperText error={error}>{errorMsg}</FormHelperText>
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="로그인 유지"
                            />
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
                                    <Link href="#" variant="body2">
                                        패스워드 찾기
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