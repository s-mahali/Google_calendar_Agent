import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { serviceAxiosInstance } from "../config/axios";

const UpperHeroComp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await serviceAxiosInstance.get("/me");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
        navigate("/");
      }
    };
    checkAuth();
  }, []);

  console.log("isAuthenticated", isAuthenticated)

  
  return (
    <div className="flex-1  p-2 mt-20">
      <h1 className="text-4xl font-bold text-neutral-800 mb-2">
        Google Calendar
      </h1>
      <h3 className="text-2xl text-neutral-700">
        Effortlessly manage schedules with Google Calendar Assistant
      </h3>
      <div
        className="w-full border md:w-1/3  border-blue-500/60 rounded-xl p-2 mt-5 text-center 
                shadow-[0_0_15px_3px_rgba(59,130,246,0.6)] 
                hover:shadow-[0_0_25px_6px_rgba(59,130,246,0.8)] 
                transition"
      >
        <Link to={isAuthenticated ? '/new' : 'https://google-calendar-agent-i68n.onrender.com/auth'} className="text-lg font-semibold text-neutral-800">Manage calendar with chrona</Link>
      </div>
    </div>
  );
};

export default UpperHeroComp;
