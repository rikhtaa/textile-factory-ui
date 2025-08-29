"use client"
import React, { useEffect, useState } from 'react'
import { WorkersTable } from '@/components/workerTable'
import { AddWorker } from '@/components/addWorker'
import { useMutation, useQuery } from "@tanstack/react-query"
import { creatWorker, getWorkers } from '../../../http/api'
import { Worker } from '@/store'
export function CreateWorker(){
    const [workers, setWorkers] = useState<any[]>([]); 

    const {data: workersData, refetch} = useQuery({
        queryKey: ['workers'],
        queryFn: getWorkers,
        enabled: false,
    })

    useEffect(()=>{
      refetch()
    }, [])

     useEffect(() => {
        if (workersData?.data) {
            setWorkers(workersData.data);
        }
    }, [workersData]);


    const {mutate: userMutate} = useMutation({
        mutationKey: ['worker'],
        mutationFn: creatWorker, 
        onSuccess: (response)=>{
        refetch();
      if (response.data) {
        setWorkers(prevWorkers => [...prevWorkers, response.data]);
      }
        }
    })

    const handleFormData = (formData: Worker) => {
        userMutate(formData);
        setWorkers(prevWorkers => [...prevWorkers, formData]); 
    };

  return (
      <div className='w-full flex items-center justify-center overflow-hidden'>
      <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
        <h2 className='text-black text-4xl font-bold'>Workers</h2>
          <AddWorker onFormSubmit={handleFormData}/>
         <WorkersTable workers={workers}/>   
     </div>
      </div>
  )
}

export default CreateWorker