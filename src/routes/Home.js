import React, {useEffect, useState} from "react";
import customAxios from "../config/customAxios";
import METHOD_TYPE from "../common/MethodType";
import HEADER_SECTION from "../common/HeaderSection";
import { Container, createTheme, CssBaseline, Grid, ThemeProvider } from "@mui/material";
import Header from "../component/Header";

const Home = () => {
    const [ testStr, setTestStr] = useState('');
    
    function callback(str) {
        setTestStr(str);
    }

    useEffect(
        () => {
            customAxios(METHOD_TYPE.GET, "/home", callback);
        }
    );

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Header title={HEADER_SECTION.title} sections={HEADER_SECTION.sections} />
                <main>
                    <Grid container spacing={4}>
                        
                    </Grid>
                    <Grid container spacing={5} sx={{ mt: 3 }}>
                        
                    </Grid>
                </main>
                {testStr}
            </Container>
        </ThemeProvider>

    );
}

export default Home;