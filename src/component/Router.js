import React from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import EventsDetail from "../routes/EventsDetail";
import EventsList from "../routes/EventsList";
import EventsMaker from "../routes/EventsMaker";
import Home from "../routes/Home";
import Login from "../routes/Login";
import Setting from "../routes/Setting";
import SignUp from "../routes/SignUp";

const AppRouter = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/events" element={<EventsMaker />} />
                <Route path="/events/:events_id" element={<EventsDetail />} />
                <Route path="/events/list" element={<EventsList />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;