'use client'
import { DailyLoomsReport } from '@/components/dailyReportsTable'
import React from 'react'

export default function Page() {

  return (
     <div className='w-full flex items-center justify-center overflow-hidden'>
          <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
            <h2 className='text-black text-4xl font-bold'>Reports</h2>
            <DailyLoomsReport />
         </div>
          </div>
  )
}

