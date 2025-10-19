import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { serviceAxiosInstance } from "../config/axios";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

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
    checkAuth()
  }, [navigate]);

  if (isAuthenticated === null) {
    return <div className="flex min-h-screen justify-center items-center text-xl animate-pulse duration-200">Loading...</div>
  }

  return isAuthenticated ? children : navigate('/')
};

export default ProtectedRoute;
