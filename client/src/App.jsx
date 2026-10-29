import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Sell from "./pages/Sell";
import Profile from "./pages/Profile";

import "./css/global.css";

function App() {
    
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));

    return (
        <BrowserRouter>

            <Routes>


                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/register" element={<Register setUser={setUser} />} />


                <Route
                    path="/home"
                    element={user ? <Home setUser={setUser} /> : <Navigate to="/login" />}
                />
                
                <Route
                    path="/sell"
                    element={user ? <Sell user={user} setUser={setUser} /> : <Navigate to="/login" />}
                />

                <Route
                    path="/profile"
                    element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />}
                />


                <Route path="*" element={<Navigate to="/" />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
