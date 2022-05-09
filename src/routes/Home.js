import React, {useEffect, useState} from "react";
import API from "../config/customAxios";
import FeaturedPost from "../component/FeaturedPost";
import moment from "moment";
import { createEventMainImage } from "../common/Utils";
import { Grid } from "@mui/material";


const Home = () => {

    const [events, setEvents] = useState([]);
    
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
                event.key = data.id;
                createEventMainImage(event);
                event.date = moment(event.eventsTime).format('YYYY-MM-DD HH시 mm분');
                return event;
            }
        )
        setEvents(data);

    }

    return (

        <main>
            <Grid container spacing={4}>
                {events.map(event => (
                    <FeaturedPost key={event.id} post={event} />
                ))}
            </Grid>
        </main>


    );
}

export default Home;