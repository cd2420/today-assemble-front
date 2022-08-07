import React, {useState, useEffect} from "react";

import Container from '@mui/material/Container';
import { getAccountsDataByJwt, getLocalStorageData } from "../common/Utils";
import { Box, Button, ButtonGroup, Grid} from "@mui/material";

import MyEventsListPage from "../component/pagination/MyEventsListPage";
import LikesEventsListPage from "../component/pagination/LikesEventsListPage";

import Profile from "../component/setting/Profile";
import PasswordPage from "../component/setting/PasswordPage";
import { useNavigate } from "react-router-dom";


const Setting = () => {

    const navigate = useNavigate();

    const [accounts, setAccounts] = useState(null);
    const [profilePage, setProfilePage] = useState(true);
    const [passwordPage, setPasswordPage] = useState(false);
    const [myEventsPage, setMyEventsPage] = useState(false);
    const [likeEventsPage, setLikeEventsPage] = useState(false);

    useEffect(() => {
        const data = getLocalStorageData();
        if (!data.is_ok) {
            // dataInit(_jwt);
            navigate('/login');
        } else {
            const jwt = data._jwt;
            getAccounts(jwt);
        }
    }, [])

    const getAccounts = async (jwt) => {

        const {data, is_error, is_false }= await getAccountsDataByJwt(jwt, true);
        if (!is_false && !is_error) {
            setAccounts(data);
        } else {
            navigate('/login');
        } 
    }

    const changePage = (e) => {
        e.preventDefault();
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

    return (

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
                            <Profile accounts={accounts} />
                        )
                    }
                    {
                        (accounts && !profilePage && passwordPage && !myEventsPage && !likeEventsPage) && (
                            <PasswordPage accounts={accounts} />
                        )
                    }
                    {
                        (accounts && !profilePage && !passwordPage && myEventsPage && !likeEventsPage) && (
                            <MyEventsListPage />
                        )
                    }
                    {
                        (accounts && !profilePage && !passwordPage && !myEventsPage && likeEventsPage) && (
                            <LikesEventsListPage />
                        )
                    }
                </Grid>
            </Grid>
        </Container>


    );

}

export default Setting;