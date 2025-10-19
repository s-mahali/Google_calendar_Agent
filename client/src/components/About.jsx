import React from 'react';
import { Github, Cpu, Bot, CalendarCheck, Zap, Code } from 'lucide-react';

const TechCard = ({ icon, name, description }) => (
  <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
    </div>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const About = () => {
  const techStack = [
    { name: 'React', icon: <Zap size={20} className="text-sky-500" />, description: 'For building a dynamic and responsive user interface.' },
    { name: 'TypeScript', icon: <Code size={20} className="text-blue-600" />, description: 'To ensure type safety and improve code quality.' },
    { name: 'LangChain & LangGraph', icon: <Bot size={20} className="text-purple-500" />, description: 'For orchestrating complex AI agentic workflows.' },
    { name: 'Groq', icon: <Cpu size={20} className="text-green-500" />, description: 'Providing high-speed inference for the language model.' },
    { name: 'Nodejs/Bun', icon: <Zap size={20} className="text-yellow-500" />, description: 'As the fast, all-in-one JavaScript runtime and toolkit.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-white p-4 rounded-full shadow-lg mb-4">
            <CalendarCheck className="text-indigo-500" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Calendar Assistant</h1>
          <p className="text-lg text-gray-600">Your intelligent partner for seamless calendar management.</p>
        </div>

        {/* How it works */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Assists You</h2>
          <p className="text-gray-700 leading-relaxed">
            This Calendar Assistant is powered by an advanced AI agent that understands natural language. Simply chat with the assistant to schedule appointments, check your availability, or get a summary of your upcoming events. It securely connects to your Google Calendar, transforming complex scheduling tasks into simple conversations.
          </p>
        </div>

        {/* Tech Stack */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Technology Stack</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map(tech => <TechCard key={tech.name} {...tech} />)}
          </div>
        </div>

        {/* GitHub Profile */}
        <div className="text-center">
           <a 
            href="https://github.com/s-mahali"
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-900 transition-colors duration-300"
          >
            <Github size={20} />
            Visit My GitHub Profile
          </a>
        </div>

      </div>
    </div>
  );
};

export default About;