import React, {useState} from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import EventsDetail from "./EventsDetail";
import EventsList from "./EventsList";
import Home from "./Home";
import Login from "./Login";
import Setting from "./Setting";
import SignUp from "./SignUp";
import Events from "./Events";
import SearchPage from "./SearchPage";
import HEADER_SECTION from "../common/HeaderSection";
import Header from "../component/Header";
import EventsPlaceSearch from "./EventsPlaceSearch";

const AppRouter = () => {

    const [accounts, setAccounts] = useState(null);
    const getAccounts = (data) => {
        setAccounts(data);
    }

    return (
        <BrowserRouter>
            <Header title={HEADER_SECTION.title} sections={HEADER_SECTION.sections} _getAccounts={getAccounts}/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/setting" element={<Setting accounts={accounts}/>} />
                <Route path="/events" element={<Events flag={'C'}/>} />
                <Route path="/events/update/:events_id" element={<Events flag={'U'}/>} />
                <Route path="/events/:events_id" element={<EventsDetail accounts={accounts}/>} />
                <Route path="/events/list" element={<EventsList />} />
                <Route path="/events/place" element={<EventsPlaceSearch />} />
                <Route path="/search" element={<SearchPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;