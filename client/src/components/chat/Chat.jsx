import React, { useEffect, useState } from "react";
import { serviceAxiosInstance } from "../../config/axios";
import useStore from "../../store/store.js";
import { v4 as uuidv4 } from "uuid";
import { CircleFadingPlus } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ReactMarkdown from 'react-markdown'

const Chat = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [thread_id, setThread_id] = useState("");
  const [isNewSession, setIsNewSession] = useState(false);
  const navigate = useNavigate();
  const { thread_id: paramThreadId } = useParams();

  

  const {
    chatMessages,
    addMessage,
    sessions,
    setSessions,
    setChatMessages,
    clearChat,
  } = useStore();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await serviceAxiosInstance.get("/session");
        if (response.status === 200) {
          setSessions(response?.data?.payload);
          console.log("allSession", response.data.payload);
        }
      } catch (error) {
        console.error("Error fetching sessions: ", error);
      }
    };
    fetchSessions();
  }, [setSessions]);

  useEffect(() => {
    const fetchSessionMessages = async (id) => {
      setLoading(true);
      console.log("fetching sessionMessage")
      try {
        const response = await serviceAxiosInstance.get(`/session/${id}`);
        if (response.status === 200) {
          setChatMessages(response.data.payload.messages);
        }
      } catch (error) {
        console.error("Error fetching session messages", error);
        navigate("/new");
      } finally {
        setLoading(false);
      }
    };
    if(paramThreadId){
      console.log("if")
      setThread_id(paramThreadId);
      fetchSessionMessages(paramThreadId)
    }else{
      console.log("else")
      //This is a new chat
      setThread_id(uuidv4());
      clearChat();
    }
  },[paramThreadId, navigate, setChatMessages, clearChat]);

  useEffect(() => {
    console.log("refreshtoken hit");
    async function handleTokenLife() {
      const res = await serviceAxiosInstance.post("/refresh-token");
      console.log("res", res);
    }
    handleTokenLife();
  }, []);

  const handleQueryChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
  };

  const handleChatAgent = async () => {
    if (!query.trim()) return;
    const currentThreadId = paramThreadId || thread_id
    addMessage({ role: "human", content: query });
    setQuery("");
    setLoading(true);
    try {
      console.log("thread_id", thread_id);
      console.log("paramThreadid", paramThreadId);
      const response = await serviceAxiosInstance.post("/chat", {
        query,
        thread_id: currentThreadId
      });
      if (response.status === 200) {
        console.log(response?.data);
        addMessage({ role: "ai", content: response?.data?.payload?.data });
        if(!paramThreadId){
          navigate(`/chat/${currentThreadId}`)
        }
      }
    } catch (error) {
      console.error("error at chatAgent", error?.message);
      addMessage({
        role: "ai",
        content: "Sorry, I couldn't get a response. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    navigate(`/new`);
    } 
  

  return (
    <div className="h-screen bg-gradient-to-br from-gray-100 via-zinc-100 to-blue-100 text-neutral-800">
      <div className="grid md:grid-cols-5 md:grid-rows-[1fr_auto] grid-cols-1 grid-rows-[auto_auto_auto] gap-4 h-full p-4">
        {/* Sidebar */}
        <aside className="col-span-1 row-span-2 bg-gradient-to-br from-gray-100 via-zinc-100 to-indigo-100 backdrop-blur-md rounded-2xl  p-4 shadow-sm">
          <div
            className="w-full p-2 flex gap-3 bg-blue-100 rounded-lg cursor-pointer  mb-5"
            onClick={handleNewChat}
          >
            <button className="text-sm lg:text-md font-semibold">
              New Chat
            </button>
            <CircleFadingPlus />
          </div>
          <h2 className="text-lg font-semibold mb-3">Sessions</h2>
          <ul className="space-y-2">
           {
            sessions.map((session) => (
              <Link to={`/chat/${session.thread_id}`} key={session.thread_id}>
                <li className={`p-2 rounded-lg hover:bg-blue-100 cursor-pointer ${paramThreadId === session.thread_id ? 'bg-blue-200' : ''}`}>
                  {session.messages[0]?.content.substring(0, 25)}...
                </li>
              </Link>
            )) 
           }
          </ul>
        </aside>

        {/* Chat Window */}
        <main className="col-span-3 row-span-1 from-gray-100 via-zinc-100 to-indigo-100 backdrop-blur-md rounded-2xl p-4 shadow-sm flex flex-col overflow-hidden">
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "human" ? "justify-end" : "justify-start"
                } `}
              >
                <div
                  className={`p-3 rounded-xl max-w-lg ${
                    message.role === "human"
                      ? "bg-indigo-900/50 text-white"
                      : "text-slate-800"
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="text-indigo-400 animate-pulse p-3">
                  Loading...
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Input Section */}
        <footer className="col-span-3 row-span-1 bg-indigo-100 backdrop-blur-md rounded-2xl border border-blue-200 p-3 flex items-center gap-3 shadow-sm">
          <textarea
            placeholder="Type your message..."
            className="flex-1 bg-transparent resize-none outline-none p-2 h-20 rounded-md"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey &&(e.preventDefault(), handleChatAgent())}
          />
          <button
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-xl shadow-md"
            onClick={handleChatAgent}
            disabled={loading}
          >
            Send
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Chat;
