import moment from 'moment';
import React, {useState, useEffect} from 'react';
import { RESPONSE_STATUS } from '../../common/ResponseStatus';
import { createEventMainImage } from '../../common/Utils';
import API from '../../config/customAxios';
import PaginatedItems from './PaginatedItems';


const MyEventsListPage = ({jwt}) => {

    // We start with an empty list of items.
    const itemsPerPage = 9;
    const [currentItems, setCurrentItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    
    useEffect(
        () => {
            getHomeData(0)
        }
        ,[]
    );

    const getHomeData = async (page) => {
        const {data, status} = await API.get(`/api/v1/accounts/events?page=${page}`, {
            headers : {
                'Authorization': jwt
            }
        })
        if (status === RESPONSE_STATUS.OK) {
            printMainPage(data)
            if (totalItems === 0) {
                await getEventsTotal();
            }
        }
    }

    const printMainPage = (data) => {
        data.map(event => 
            {
                event.key = data.id;
                createEventMainImage(event);
                event.date = moment(event.eventsTime).format('YYYY-MM-DD HH시 mm분');
                return event;
            }
        )
        setCurrentItems(data);
    }

    const getEventsTotal = async () => {
        const {data, status} = await API.get("/api/v1/accounts/events/size", {
            headers : {
                'Authorization': jwt
            }
        });
        if (status === RESPONSE_STATUS.OK) {
          setTotalItems(data);
          setPageCount(Math.ceil(data / itemsPerPage));
        }
    }

      // Invoke when user click to request another page.
    const handlePageClick = async (event, value) => {
        getHomeData(value - 1);
    };

    return (
        <main>
            <PaginatedItems handlePageClick={handlePageClick} currentItems={currentItems} pageCount={pageCount} />
        </main>
    )
}

export default MyEventsListPage;