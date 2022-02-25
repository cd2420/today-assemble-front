import React, {useEffect, useState} from "react";
import API from "../config/customAxios";
import HEADER_SECTION from "../common/HeaderSection";
import { Container, createTheme, CssBaseline, Grid, ThemeProvider } from "@mui/material";
import Header from "../component/Header";
import FeaturedPost from "../component/FeaturedPost";
import moment from "moment";

const Home = () => {
    const [ events, setEvents] = useState([]);
    
    useEffect(
        () => {
            async function getHomeData() {
                const {data} = await API.get("/api/v1/home")
                printMainPage(data)
            }
            getHomeData()
        }
        ,[]
    );

    function printMainPage(data) {
        data.map(event => 
            {
                event.key = data.id
                createMainImage(event)
                event.date = moment(event.eventsTime).format('YYYY-MM-DD HH시 mm분')
                return event
            }
        )
        setEvents(data);

    }

    function createMainImage(event) {
        const checkMainImages = event.eventsImagesDtos.filter(
            item => {
                return item.imagesType === 'MAIN'
            }
        )

        if (checkMainImages.length > 0) {
            event.mainImage = checkMainImages[0].image
        } else {
            event.mainImage = 'https://source.unsplash.com/random'
        }
    }


    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Header title={HEADER_SECTION.title} sections={HEADER_SECTION.sections} />
                <main>
                    <Grid container spacing={4}>
                        {events.map(event => (
                            <FeaturedPost key={event.id} post={event} />
                        ))}
                    </Grid>
                </main>
            </Container>
        </ThemeProvider>

    );
}

export default Home;