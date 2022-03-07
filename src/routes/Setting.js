import React, {useState, useEffect} from "react";
import HEADER_SECTION from "../common/HeaderSection";
import Header from "../component/Header";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getLocalStorageData } from "../common/Utils";
import { Box, Button, ButtonGroup, Grid} from "@mui/material";

import Profile from "../component/Profile";

const Setting = () => {

    const [accounts, setAccounts] = useState(null);
    const [jwt, setJwt] = useState('');
    const [profilePage, setProfilePage] = useState(true);
    const [passwordPage, setPasswordPage] = useState(false);
    const [myEventsPage, setMyEventsPage] = useState(false);
    const [likeEventsPage, setLikeEventsPage] = useState(false);

    useEffect(() => {
        const {_accounts, _jwt, is_ok } = getLocalStorageData()
        if (is_ok) {
            setJwt(_jwt)
            const tmp_accounts = JSON.parse(_accounts)
            tmp_accounts.birth = new Date(tmp_accounts.birth)
            setAccounts(tmp_accounts)
        } else {
            window.location.href='/login'
        }
    }, [])

    const changePage = (e) => {
        const {target: {name}} = e;
        if (name === "profile") {
            setProfilePage(true)
            setPasswordPage(false)
            setMyEventsPage(false)
            setLikeEventsPage(false)
            
        } else if (name === "password") {
            setProfilePage(false)
            setPasswordPage(true)
            setMyEventsPage(false)
            setLikeEventsPage(false)

        } else if (name === "events") {
            setProfilePage(false)
            setPasswordPage(false)
            setMyEventsPage(true)
            setLikeEventsPage(false)

        } else if (name === "likes") {
            setProfilePage(false)
            setPasswordPage(false)
            setMyEventsPage(false)
            setLikeEventsPage(true)

        }
    }

    const buttons = [
        <Button key="1" name="profile" variant={profilePage ? "contained" : "outlined" } onClick={changePage}>내 계정</Button>,
        <Button key="2" name="password" variant={passwordPage ? "contained" : "outlined" } onClick={changePage}>비밀번호 변경</Button>,
        <Button key="3" name="events" variant={myEventsPage ? "contained" : "outlined" } onClick={changePage}>내 모임</Button>,
        <Button key="4" name="likes" variant={likeEventsPage ? "contained" : "outlined" } onClick={changePage}>관심 모임</Button>
    ];


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
                                (accounts && profilePage && !passwordPage && !myEventsPage && !likeEventsPage) && (
                                    <Profile accounts={accounts} jwt={jwt} />
                                )
                            }
                        </Grid>
                    </Grid>
                </Container>
            </Container>
        </ThemeProvider>

    );

}

export default Setting;