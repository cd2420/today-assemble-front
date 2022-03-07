import React from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom";
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
            </Routes>
        </BrowserRouter>
    );
                
}

export default AppRouter;