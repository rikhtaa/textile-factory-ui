'use client'
import { Operator15DayReport } from '@/components/15dayOperatorReportTable'
import { BeamUsageReport } from '@/components/beamUsageReport'
import { DailyQualityReport } from '@/components/dailyQualityReportTable'
import { DailyLoomsReport } from '@/components/dailyReportsTable'
import { OperatorPeriodReport } from '@/components/operatorPeriodReportTable'
import { PayrunReport } from '@/components/payrunReport'
import { ShiftWiseProductionReport } from '@/components/ShiftWiseProduction'
import React from 'react'

export default function Page() {

  return (
     <div className='w-full flex items-center justify-center overflow-hidden'>
          <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
            <h2 className='text-black text-4xl font-bold'>Reports</h2>
            <DailyLoomsReport />
            <DailyQualityReport/>
            <Operator15DayReport/>
            <OperatorPeriodReport/>
            <PayrunReport/>
            <BeamUsageReport/>
            <ShiftWiseProductionReport/>
         </div>
          </div>
  )
}

