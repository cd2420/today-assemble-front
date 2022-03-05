import React, {useState, useEffect} from "react";
import API from "../config/customAxios";
import HEADER_SECTION from "../common/HeaderSection";
import Header from "../component/Header";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getLocalStorageData } from "../common/Utils";
import { Box, Button, ButtonGroup, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { TabsUnstyled } from "@mui/base";
import DateComponent from "../component/DateComponent";
import { Label } from "@mui/icons-material";



const Profile = () => {

    const [accounts, setAccounts] = useState(null)
    const [accountsPage, setAccountsPage] = useState(true)

    const [myEventsPage, setMyEventsPage] = useState(false)
    const [myLikesPage, setMyLikesPage] = useState(false)

    const buttons = [
        <Button key="1">내 계정</Button>,
        <Button key="2">내 모임</Button>,
        <Button key="3">관심 모임</Button>,
      ];

    useEffect(() => {
        const {_accounts, is_ok } = getLocalStorageData()
        if (is_ok) {
            setAccounts(JSON.parse(_accounts))
        } else {
            window.location.href='/login'
        }
    }, [])

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
                                            <TextField
                                                required
                                                fullWidth
                                                id="email"
                                                label="Email"
                                                name="email"
                                                autoComplete="email"
                                                value={ accounts.email}
                                                disabled
                                                // onChange={onChange}
                                                // error={emailError}
                                                // helperText={emailErrorText}
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
                                                value={accounts.name}
                                                disabled
                                                // onChange={onChange}
                                                // error={userNameError}
                                                // helperText={userNameErrorText}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl
                                                required
                                                disabled
                                                // onChange={onChange}
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
                                                // onChange={onChange} 
                                                date = {accounts.birth}
                                            />
                                        </Grid>
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