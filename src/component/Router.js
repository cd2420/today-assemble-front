import React from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "../routes/Home";
import Login from "../routes/Login";
import Profile from "../routes/Profile";
import SignUp from "../routes/SignUp";

const AppRouter = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
                
}

export default AppRouter;