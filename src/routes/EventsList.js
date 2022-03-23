import React from "react";
import HEADER_SECTION from "../common/HeaderSection";
import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Header from "../component/Header";
import PaginatedItems from "../component/PaginatedItems";


const EventsList = () => {

    
    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Header title={HEADER_SECTION.title} sections={HEADER_SECTION.sections} />
                <main>
                    <PaginatedItems itemsPerPage={8} />
                </main>
            </Container>
        </ThemeProvider>

    );
}

export default EventsList;