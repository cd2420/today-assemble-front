import React from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import EventsDetail from "./EventsDetail";
import EventsList from "./EventsList";
import Home from "./Home";
import Login from "./Login";
import Setting from "./Setting";
import SignUp from "./SignUp";
import Events from "./Events";
import SearchPage from "./SearchPage";

const AppRouter = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/events" element={<Events flag={'C'}/>} />
                <Route path="/events/update/:events_id" element={<Events flag={'U'}/>} />
                <Route path="/events/:events_id" element={<EventsDetail />} />
                <Route path="/events/list" element={<EventsList />} />
                <Route path="/search" element={<SearchPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;