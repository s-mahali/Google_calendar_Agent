import React from 'react'
import agentLogo from "../assets/agent.png"
import { Link } from 'react-router-dom'

const Navbar = () => {

    const navItems = [
        {
           id: 1,
           name: 'Platform',
           path: '/'
        },
        {
            id: 2,
            name: 'About',
            path: '/about'
        }
    ]
  return (
    <div className='flex justify-between items-center p-2'>
        <div className=''>
            <span className='text-3xl text-transparent font-bold bg-clip-text bg-gradient-to-r from-indigo-300 via-blue-400 to-indigo-800 p-2'>Chrona</span>
        </div>
        <ul className='flex gap-4'>
            {navItems.map((item) => (
                <Link to={item.path} key={item.id}  className='text-2xl cursor-pointer font-medium  hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>{item.name}</Link>
            ))}
        </ul>
        <img src={agentLogo}/>
    </div>
  )
}

export default Navbar

{/* <h2 className="text-4xl w-full text-transparent bg-clip-text font-extrabold bg-gradient-to-r from-white to-sky-500/10 p-2">
       Welcome To <br /> My Personal PortFolio 
</h2> */}