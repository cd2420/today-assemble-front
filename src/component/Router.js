import React from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import EventsDetail from "../routes/EventsDetail";
import EventsList from "../routes/EventsList";
import Home from "../routes/Home";
import Login from "../routes/Login";
import Setting from "../routes/Setting";
import SignUp from "../routes/SignUp";
import Events from "../routes/Events";

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
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;