import {  Grid } from '@mui/material';
import moment from 'moment';
import React, {useState, useEffect} from 'react';
import { RESPONSE_STATUS } from '../common/ResponseStatus';
import { createEventMainImage } from '../common/Utils';
import API from '../config/customAxios';
import FeaturedPost from './FeaturedPost';


const MyEventsListPage = ({jwt}) => {

    const [events, setEvents] = useState([]);
    
    useEffect(
        () => {
            async function getHomeData() {
                const {data, status} = await API.get("/api/v1/accounts/events", {
                    headers : {
                        'Authorization': jwt
                    }
                })
                if (status === RESPONSE_STATUS.OK) {
                    printMainPage(data)
                }
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
        <Grid container spacing={4}>
            {events.map(event => (
                <FeaturedPost key={event.id} post={event} />
            ))}
        </Grid>
    )
}

export default MyEventsListPage;