import React, { useEffect, useState } from "react";
import HEADER_SECTION from "../common/HeaderSection";
import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Header from "../component/Header";
import PaginatedItems from "../component/pagination/PaginatedItems";
import API from "../config/customAxios";
import { RESPONSE_STATUS } from "../common/ResponseStatus";
import { createEventMainImage } from "../common/Utils";
import moment from "moment";
import { useLocation } from "react-router-dom";
import QueryString from "qs";


const SearchPage = () => {

    const location = useLocation();

    // We start with an empty list of items.
    const itemsPerPage = 9;
    const [currentItems, setCurrentItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    useEffect(
        () => {
            getEventsList(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        } ,[location.search]
    );

    const getEventsList = async (page) => {
        const queryData = QueryString.parse(location.search, { ignoreQueryPrefix: true });
        const {keyword} = queryData;
        // const keyword = params.keyword;
        
        try {
            const {data, status} = await API.get(`/api/v1/search/?keyword=${keyword}&page=${page}`);
            const tmp_events = data;
            if (status === RESPONSE_STATUS.OK) {
                printMainPage(tmp_events);
                await getEventsTotal(keyword);
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
        const {data, status} = await API.get(`/api/v1/search/size?keyword=${keyword}`);
        if (status === RESPONSE_STATUS.OK) {
          setTotalItems(data);
          setPageCount(Math.ceil(data / itemsPerPage));
        }
    }

      // Invoke when user click to request another page.
    const handlePageClick = async (event, value) => {
        getEventsList(value - 1);
    };

    
    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Header title={HEADER_SECTION.title} sections={HEADER_SECTION.sections} />
                <main>
                    <PaginatedItems handlePageClick={handlePageClick} currentItems={currentItems} pageCount={pageCount} />
                </main>
            </Container>
        </ThemeProvider>

    );
}

export default SearchPage;