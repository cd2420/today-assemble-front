import React from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "../routes/Home";
import Login from "../routes/Login";
import SignUp from "../routes/SignUp";

const AppRouter = () => {
  
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signUp" element={<SignUp />} />
            </Routes>
        </BrowserRouter>
    );
                
}

export default AppRouter;