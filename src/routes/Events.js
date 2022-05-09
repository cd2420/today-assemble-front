import React, {useState, useEffect} from "react";
import EventsMaker from "../component/event/EventsMaker";
import EventsUpdate from "../component/event/EventsUpdate";
import { useNavigate, useParams } from "react-router-dom";
import API from "../config/customAxios";
import { RESPONSE_STATUS } from "../common/ResponseStatus";
import { getLocalStorageData } from "../common/Utils";


const Events= ({flag}) => {

    const params = useParams();
    const navigate = useNavigate();

    const [events, setEvents] = useState(null);
    const [jwt, setJwt] = useState('');

    useEffect(() => {
        const {_jwt, is_ok} = getLocalStorageData();
        if (_jwt && is_ok) {
            setJwt(_jwt);
        } else {
            navigate('/login');
        }
        if (flag === 'U' && params.events_id) {
            getEvent(params.events_id)
        }
    }, [])


    const getEvent = async (eventId) => {
        try {
            const {data, status}  = await API.get(`/api/v1/events/${eventId}`);
            if (status === RESPONSE_STATUS.OK && data) {
                setEvents(data);
            }
            
        } catch(e) {
            console.log(e);
            navigate(-1);
        }

    }

    return (

        <main>
            {
                flag === 'C'
                ? 
                (
                    <EventsMaker jwt={jwt}/>
                )
                :
                (
                    events &&
                    <EventsUpdate events={events} jwt={jwt}/>
                )
            }
        </main>

    );
}

export default Events;