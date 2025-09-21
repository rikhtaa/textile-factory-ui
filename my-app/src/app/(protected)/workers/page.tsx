"use client"
import React from 'react'
import { WorkersTable } from '@/components/workerTable'
import { AddWorker } from '@/components/addWorker'
import { useMutation, useQuery } from "@tanstack/react-query"
import { creatWorker, getWorkers } from '../../../http/api'
import { ApiErrorResponse, Worker } from '@/store'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
export default function Page() {
const {data: workersData, refetch} = useQuery({
        queryKey: ['workers'],
        queryFn: getWorkers,
    })

    const {mutate: userMutate, isPending} = useMutation({
        mutationKey: ['workers'],
        mutationFn: creatWorker, 
        onSuccess: ()=>{
        refetch();
            toast.success("Worker has been created");
        },
       onError: (error: AxiosError<ApiErrorResponse>) => {
            if (error.response?.status === 409) {
            toast.error("Worker already exists");
            }else if (error.response?.status === 403) {
             toast.error("Only admin and manager can create Worker.");
            }else if(error.response?.data?.message.includes('E11000')){
               toast.error("This email is already registered. Please use a different email.");
            }else if(error.response && error.response.status >= 500){
              toast.error("Internet issue please try again later");
            } else {
            toast.error(error.response?.data?.message || error.message || "An error occurred");
            }
        }
    })

    const handleFormData = (formData: Worker) => {
        userMutate(formData);
    };

  return (
      <div className='w-full flex items-center justify-center overflow-hidden'>
      <div className='flex flex-col gap-7 w-[85%] py-[1rem]'>
        <h2 className='text-black text-4xl font-bold'>Workers</h2>
          <AddWorker onFormSubmit={handleFormData} isPending={isPending}/>
         <WorkersTable workers={workersData?.data || []}/>   
     </div>
      </div>
  )
}

