import React from 'react'
import LeftSidebar from '../components/LeftSidebar'
import UpperHeroComp from '../components/UpperHeroComp'
import LowerHeroComp from '../components/LowerHeroComp'

const HomePage = () => {
  return (
    <div className='flex flex-col gap-10  min-h-screen'>
        <div className='flex gap-2'>
        <LeftSidebar/>
        <UpperHeroComp/>
        </div>
        <div className=''>
          <LowerHeroComp/>
        </div>
    </div>
  )
}

export default HomePage