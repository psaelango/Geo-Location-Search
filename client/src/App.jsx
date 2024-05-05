import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./routes/Home";
import LocationSearch from "./routes/LocationSearch";
import NearByLocations from "./routes/NearByLocations";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const path = window.location.pathname;
    if (!user) {
      if (path === "/register") {
        navigate("/register");
      } else {
        navigate("/login");
      }
    } else {
      let redirect = path === "/" ? "/home" : path;
      navigate(redirect);
    }
  }, [user, navigate]);

  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/location-search" element={<LocationSearch />} />
      <Route path="/nearby-locations" element={<NearByLocations />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default Dashboard;
