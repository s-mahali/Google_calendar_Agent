import React from "react";
import googleCalendar from "../assets/google-calendar.svg";



const LeftSidebar = () => {
  const handleGoogleCalendarAuth = async () => {
   console.log("click")
    try {
       window.location.href = 'https://google-calendar-agent-i68n.onrender.com/auth'
       
    } catch (error) {
      console.error("error authenticating user", error?.message)
    }
} 
  return (
    <div className="max-w-md w-1/3  flex flex-col gap-5 items-start mt-20">
      <div className="flex flex-col gap-4 items-start ">
        <div className=" w-20 h-20">
          <img
            src={googleCalendar}
            alt="calendar-svg"
            className="object-cover aspect-square"
          />
        </div>
        <button className="bg-blue-600 py-2 px-4 text-xl rounded-md text-white cursor-pointer" onClick={handleGoogleCalendarAuth}>
          Connect Google Calendar 
        </button>
      </div>
      <div className="w-1/2 border-t mt-1 border-neutral-600"></div>
      <div>
        <h3 className="font-bold text-neutral-800 text-xl">Built By</h3>
        <span className="font-xs text-lg text-neutral-700">Soumen</span>
      </div>
    </div>
  );
};

export default LeftSidebar;
