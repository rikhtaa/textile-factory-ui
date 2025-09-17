"use client"
import { Worker } from "@/store"
import { Button } from "./ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteWorker, updateWorker } from "@/http/api"
import { useState } from "react"
import { toast } from "sonner"

export function WorkersTable({ workers }: { workers: Worker[] }) {
   const queryClient = useQueryClient()
    const [editingWorker, setEditingWorker] = useState<Worker | null>(null)
  const deleteMutaution = useMutation({
    mutationFn: deleteWorker,
    onMutate: async (workerId) => {
     await queryClient.cancelQueries({ queryKey: ['workers'] })
      
      const previousWorkers = queryClient.getQueryData(['workers']) as { data: Worker[] }
      queryClient.setQueryData(['workers'], (old: { data: Worker[] }) => ({
        data: old.data.filter(worker => worker._id !== workerId)
      }))
      
      return { previousWorkers }
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey: ['workers']})
       toast.success("Worker removed successfully");
    },
    onError: (error: any) => {
      if (error.response?.status === 404) {
       toast.error("Woker have been already deleted");
      }else if(error.response?.status >= 500){
       toast.error("Internet issue please try again later");
      }
      else{
       toast.error(error.response?.data?.message || error.message);
      }
    }
  })

const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Worker> }) => 
      updateWorker(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['workers'] })
      const previousWorkers = queryClient.getQueryData(['workers']) as { data: Worker[] }
      queryClient.setQueryData(['workers'], (old: { data: Worker[] }) => ({
        data: old.data.map(worker => 
          worker._id === id ? { ...worker, ...data } : worker
        )
      }))
      return { previousWorkers }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] })
      setEditingWorker(null)
      toast.success("Woker has been updated");
    },
     onError: (error: any) => {
      if(error.response?.status === 500 ||error.response?.data?.message.includes('ENOTFOUND') || error.message?.includes('ENOTFOUND')){
        toast.error("No internet connection.")
      }else{
        toast.error(error.response?.data?.message || error.message );
      }
    }
  })

  const handleDelete = (workerId: string)=>{
    console.log('Deleting worker with ID:', workerId) 
    deleteMutaution.mutate(workerId)
  }
   const handleUpdate = (id: string, data: Partial<Worker>) => {
    updateMutation.mutate({ id, data })
  }

  const handleEditClick = (worker: Worker) => {
    setEditingWorker(worker)
  }
   const handleSaveEdit = () => {
    if (editingWorker) {
      const { _id, ...updateData } = editingWorker
      handleUpdate(_id, updateData)
    }
  }
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Role</th>
          <th className="border px-4 py-2">Email</th>
          <th className="border px-4 py-2">Phone</th>
          <th className="border px-4 py-2">Status</th>
          <th className="border px-4 py-2">Hire Date</th>
          <th className="border px-4 py-2">Update</th>
          <th className="border px-4 py-2">Delete</th>
        </tr>
      </thead>
       <tbody>
          {workers.map((w, i) => (
            <tr key={i}>
              <td className="border px-4 py-2">
                <input
                  value={editingWorker?._id === w._id ? editingWorker.name : w.name}
                  onChange={(e) => editingWorker?._id === w._id && 
                    setEditingWorker({ ...editingWorker, name: e.target.value })}
                  className="w-full border-none bg-transparent"
                  readOnly={editingWorker?._id !== w._id}
                />
              </td>
              <td className="border px-4 py-2">
                <select
                  value={editingWorker?._id === w._id ? editingWorker.role : w.role}
                  onChange={(e) => editingWorker?._id === w._id && 
                    setEditingWorker({ ...editingWorker, role: e.target.value })}
                  className="w-full border-none bg-transparent"
                  disabled={editingWorker?._id !== w._id}
                >
                  <option value="admin">admin</option>
                  <option value="manager">manager</option>
                  <option value="operator">operator</option>
                  <option value="warper">warper</option>
                </select>
              </td>
              <td className="border px-4 py-2">
                <input
                  value={editingWorker?._id === w._id ? editingWorker.email : w.email}
                  onChange={(e) => editingWorker?._id === w._id && 
                    setEditingWorker({ ...editingWorker, email: e.target.value })}
                  className="w-full border-none bg-transparent"
                  readOnly={editingWorker?._id !== w._id}
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  value={editingWorker?._id === w._id ? editingWorker.phone : w.phone}
                  onChange={(e) => editingWorker?._id === w._id && 
                    setEditingWorker({ ...editingWorker, phone: Number(e.target.value) })}
                  className="w-full border-none bg-transparent"
                  readOnly={editingWorker?._id !== w._id}
                />
              </td>
              <td className="border px-4 py-2">
                <select
                  value={editingWorker?._id === w._id ? editingWorker.status : w.status}
                  onChange={(e) => editingWorker?._id === w._id && 
                    setEditingWorker({ ...editingWorker, status: e.target.value })}
                  className="w-full border-none bg-transparent"
                  disabled={editingWorker?._id !== w._id}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </td>
              <td className="border px-4 py-2">
                {w.hireDate ? new Date(w.hireDate).toDateString() : 'Invalid date'}
              </td>
              <td className="border px-4 py-2">
                {editingWorker?._id === w._id ? (
                  <Button variant="outline" onClick={handleSaveEdit}>
                    Save
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => handleEditClick(w)}>
                    Edit
                  </Button>
                )}
              </td>
            <td><Button variant="destructive" 
            onClick={()=> handleDelete(w._id)}
            disabled={deleteMutaution.isPending}
            > {deleteMutaution.isPending ? "Deleting..." : "Delete"}</Button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
