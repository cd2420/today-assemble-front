import React, { useState } from "react";
import PaginatedItems from "../component/pagination/PaginatedItems";
import API from "../config/customAxios";
import { RESPONSE_STATUS } from "../common/ResponseStatus";
import { createEventMainImage } from "../common/Utils";
import moment from "moment";
import { Container, Grid, IconButton, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const EventsPlaceSearch = () => {

    // We start with an empty list of items.
    const itemsPerPage = 9;
    const [currentItems, setCurrentItems] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    const onChange = (event) => {
        const {target: {value}} = event;
        setKeyword(value);
    }

    const getEventsList = async (page) => {
        try {
            const {data, status} = await API.get(`/api/v1/search/place?keyword=${keyword}&page=${page}`);
            const tmp_events = data;
            if (status === RESPONSE_STATUS.OK) {
                printMainPage(tmp_events);
                if (totalItems === 0) {
                    await getEventsTotal(keyword);
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

    const getEventsTotal = async (keyword) => {
        const {data, status} = await API.get(`/api/v1/search/place/size?keyword=${keyword}`);
        if (status === RESPONSE_STATUS.OK) {
          setTotalItems(data);
          setPageCount(Math.ceil(data / itemsPerPage));
        }
    }

      // Invoke when user click to request another page.
    const handlePageClick = async (event, value) => {
        getEventsList(value - 1);
    };

    const search = async () => {
        
        // const keyword = params.keyword;
        try {
            const {data, status} = await API.get(`/api/v1/search/place?keyword=${keyword}&page=0`);
            const tmp_events = data;
            if (status === RESPONSE_STATUS.OK) {
                printMainPage(tmp_events);
                await getEventsTotal(keyword);
            }
        } catch(e) {
            console.log(e);
        }
    }
    

    return (

        <Container 
            component="main" 
        > 

            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid
                    item
                    xs={12}
                    sx={{
                        m: 3
                    }}

                >
                    <TextField
                        // fullWidth
                        autoFocus
                        id="placeSearch"
                        label="장소 검색"
                        name="placeSearch"
                        value={keyword}
                        onChange={onChange}
                        sx={{
                            width: '50%'
                        }}
                        align="center"
                    />
                    <IconButton onClick={search}>
                        <SearchIcon />
                    </IconButton>
                </Grid>
            </Grid>
            
            {
                currentItems.length > 0
                ?
                (
                    <PaginatedItems handlePageClick={handlePageClick} currentItems={currentItems} pageCount={pageCount} />
                )
                :
                (
                    <Typography>
                        검색 결과 없습니다.
                    </Typography>
                    
                )
            }

        </Container>

    );
}

export default EventsPlaceSearch;
