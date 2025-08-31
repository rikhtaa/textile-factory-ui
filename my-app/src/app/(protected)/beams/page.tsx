'use client'

import { BeamsReport } from "@/components/beamsReportTable"

export default function Page() {

    
  return (
     <div className='w-full flex items-center justify-center overflow-hidden'>
          <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
            <h2 className='text-black text-4xl font-bold'>Beams Report</h2>
             <BeamsReport/>
         </div>
          </div>
  )
}

