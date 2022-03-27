import { Grid, Pagination } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { RESPONSE_STATUS } from '../common/ResponseStatus';
import { createEventMainImage } from '../common/Utils';
import API from '../config/customAxios';
import FeaturedPost from './FeaturedPost';

const Items = ({ currentItems }) => {
  return (
    <Grid container spacing={4}>
        {currentItems.map(item => (
            <FeaturedPost key={item.id} post={item} />
        ))}
    </Grid>
  );
}

const PaginatedItems = ({ itemsPerPage }) => {
    // We start with an empty list of items.
    const [currentItems, setCurrentItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.

    useEffect(
        () => {
            getEventsList(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        } ,[itemsPerPage]
    );

    const getEventsList = async (page) => {
        try {
            const {data, status} = await API.get(`/api/v1/events?page=${page}`);
            const tmp_events = data;
            if (status === RESPONSE_STATUS.OK) {
                printMainPage(tmp_events);
                if (totalItems === 0) {
                    await getEventsTotal();
                }
            }
        } catch(e) {
            console.log(e);
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
        const {data, status} = await API.get("/api/v1/events/size");
        if (status === RESPONSE_STATUS.OK) {
          setTotalItems(data);
          setPageCount(Math.ceil(data / itemsPerPage));
        }
    }

  // Invoke when user click to request another page.
  const handlePageClick = async (event, value) => {
    getEventsList(value - 1);
  };

  return (
    <>
      <Items currentItems={currentItems} />
      <Box
        sx={{
          '& > *': {
            m: 3,
          }
      }}
      >
        <Pagination count={pageCount} onChange={handlePageClick} color="primary" size="large"/>
      </Box>
    </>
  );
}

export default PaginatedItems;