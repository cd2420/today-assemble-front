import { ThemeProvider } from "@emotion/react";
import { Container, createTheme, CssBaseline } from "@mui/material";
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import HEADER_SECTION from "../common/HeaderSection";
import Header from "../component/Header";
import API from "../config/customAxios";


const EventsDetail = () => {
    const params = useParams();
    const [event, setEvent] = useState(null);
    useEffect(() => {
        
        const getEvent = async (eventId) => {
            try {
                const {data}  = await API.get(`/api/v1/events/${eventId}`);
                if (data) {
                    setEvent(data);
                }
            } catch(e) {
                console.log(e);
            }

        }
        if (params.events_id) {
            getEvent(params.events_id)
        }
    }, [])
    const theme = createTheme();
    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg">
                <CssBaseline />
                <Header title={HEADER_SECTION.title} sections={HEADER_SECTION.sections} />
                <Container component="main" maxWidth="xs">
                    {
                        event
                        &&
                        event.name
                    }
                    
                </Container>
            </Container>
        </ThemeProvider>

    )
}

export default EventsDetail;