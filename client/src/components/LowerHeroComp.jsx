import React from "react";
import agentanimate from "../assets/agentanimate.png";
import {
  PackagePlus,
  CalendarX2,
  CalendarDays,
  Mails,
  SquareMousePointer,
  CalendarSync,
} from "lucide-react";

const agent_tools = [
  {
    id: 1,
    name: "create_event",
    icon: <PackagePlus />,
  },
  {
    id: 2,
    name: "get_event",
    icon: <SquareMousePointer />,
  },
  {
    id: 3,
    name: "update_event",
    icon: <CalendarSync />,
  },
  {
    id: 4,
    name: "cancel_event",
    icon: <CalendarX2 />,
  },
  {
    id: 5,
    name: "mails",
    icon: <Mails />,
  },
];

const LowerHeroComp = () => {
  return (
    <div className="flex gap-3 rounded-xl  p-5  bg-indigo-100 justify-around overflow-auto">
      <div className="relative w-full max-w-md p-6 overflow-hidden  border border-neutral-300 rounded-2xl shadow-lg">
        <div
          aria-hidden="true"
          className="absolute  bg-radial from-blue-400 from-40% to-fuchsia-700 w-35 h-96 blur-3xl opacity-70"
        ></div>

        <div className="relative z-10 flex flex-col gap-4 mb-10">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-neutral-800">Agent Tasks</h2>
            <p className="text-md text-gray-500">
              Overview of all the tasks the agent can perform
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <h4 className="text-gray-700 text-lg">Create Meetings for you</h4>
              <span className="inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                ✅
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <h4 className="text-gray-700 text-lg">Get Your Schedule</h4>
              <span className="inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                ✅
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <h4 className="text-gray-700 text-lg">Get Reminders</h4>
              <span className="inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                ✅
              </span>
            </div>

             <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <h4 className="text-gray-700 text-lg">Update and cancel meetings</h4>
              <span className="inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                ✅
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-b border-gray-100">
              <h4 className="text-gray-700 text-lg">
                Automatic email add & notifications
              </h4>
              <span className="inline-flex items-center gap-x-1.5 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">
                ✅
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col gap-4 border border-neutral-300 p-6 rounded-2xl w-full max-w-md shadow-lg">
        <div
          aria-hidden="true"
          className="absolute bg-radial inset-x-0 from-red-200 from-40% to-zinc-200 w-35 h-96 blur-3xl opacity-20"
        ></div>

        <div>
          <h1 className="text-2xl font-bold text-neutral-800">
            Calendar Management AI Agent
          </h1>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-xl font-bold text-neutral-700">Agent Tools</h4>
          <ul className="flex gap-2">
            {agent_tools.map((tool) => (
              <div
                key={tool?.id}
                className="p-2 bg-gray-200 bg-blur-500 rounded-lg"
              >
                <li className="text-blue-600">{tool.icon}</li>
              </div>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-center w-full mt-10">
          <div className="relative">
            <img
              src={agentanimate}
              alt="agentanimate"
              className="w-32 h-32 object-cover rounded-4xl shadow-md border-2 border-neutral-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowerHeroComp;
