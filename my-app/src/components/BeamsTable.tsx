"use client"
import { deleteBeam, updateBeam } from "@/http/api"
import { Beam } from "@/store"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "./ui/button"

export function BeamsTable({ beams }: { beams: Beam[] }) {
     const queryClient = useQueryClient()
      const [editingBeam, setEditingBeam] = useState<Beam | null>(null)
    const deleteMutaution = useMutation({
      mutationFn: deleteBeam,
      onMutate: async (beamId) => {
       await queryClient.cancelQueries({ queryKey: ['beam'] })
        
        const previousbeams = queryClient.getQueryData(['beam']) as { data: Beam[] }
        queryClient.setQueryData(['beam'], (old: { data: Beam[] }) => ({
          data: old.data.filter(beam => beam._id !== beamId)
        }))
        
        return { previousbeams }
      },
      onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey: ['beam']})
         toast.success("Beam removed successfully");
      },
      onError: (error: any) => {
        if (error.response?.status === 404) {
         toast.error("Beam have been already deleted");
        }else if(error.response?.status >= 500){
         toast.error("Internet issue please try again later");
        }
        else{
         toast.error(error.response?.data?.message || error.message);
        }
      }
    })
  
  const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<Beam> }) => 
      updateBeam(id, data),
      onMutate: async ({ id, data }) => {
        await queryClient.cancelQueries({ queryKey: ['beam'] })
        const previousbeams = queryClient.getQueryData(['beam']) as { data: Beam[] }
        queryClient.setQueryData(['beam'], (old: { data: Beam[] }) => ({
          data: old.data.map(beam => 
            beam._id === id ? { ...beam, ...data } : beam
          )
        }))
        return { previousbeams }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['beam'] })
        setEditingBeam(null)
        toast.success("Beam has been updated");
      },
       onError: (error: any) => {
        if (error.response?.status === 404) {
         toast.error("Beam not found - it may have been deleted");
        }else if(error.response?.status === 500 ||error.response?.data?.message.includes('ENOTFOUND') || error.message?.includes('ENOTFOUND')){
          toast.error("No internet connection.")
        }else{
          toast.error(error.response?.data?.message || error.message );
        }
      }
    })
  
    const handleDelete = (beamId: string)=>{
      deleteMutaution.mutate(beamId)
    }
     const handleUpdate = (id: string, data: Partial<Beam>) => {
      updateMutation.mutate({ id, data })
    }
  
    const handleEditClick = (beam: Beam) => {
      setEditingBeam(beam)
    }
     const handleSaveEdit = () => {
      if (editingBeam) {
        const { _id, ...updateData } = editingBeam
        handleUpdate(_id!, updateData)
      }
    }
  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2">Beam Number</th>
          <th className="border px-4 py-2">Total Meters</th>
          <th className="border px-4 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {beams.map((beam, i) => (
  <tr key={beam._id || i}>
    <td className="border px-4 py-2">
      <input 
        value={editingBeam?._id === beam._id ? editingBeam?.beamNumber : beam.beamNumber}
        onChange={(e) => editingBeam?._id === beam._id && 
          setEditingBeam(prev => prev ? { ...prev, beamNumber: e.target.value } : null)}
        className="w-full border-none bg-transparent"
        readOnly={editingBeam?._id !== beam._id} 
      />
    </td>
    <td className="border px-4 py-2">
      <input
        value={editingBeam?._id === beam._id ? editingBeam?.totalMeters : beam.totalMeters}
        onChange={(e) => editingBeam?._id === beam._id && 
          setEditingBeam(prev => prev ? { ...prev, totalMeters: Number(e.target.value) } : null)}
        className="w-full border-none bg-transparent"
        readOnly={editingBeam?._id !== beam._id}
      />
    </td>
    <td className="border px-4 py-2">
      <select
        value={editingBeam?._id === beam._id ? editingBeam?.isClosed?.toString() : beam.isClosed?.toString()}
        onChange={(e) => editingBeam?._id === beam._id && 
          setEditingBeam(prev => prev ? { ...prev, isClosed: e.target.value === "true" } : null)}
        className="w-full border-none bg-transparent"
        disabled={editingBeam?._id !== beam._id}
      >
        <option value="false">Open</option>
        <option value="true">Closed</option>
      </select>
    </td>
     <td className="border px-4 py-2">
        {editingBeam?._id === beam._id ? (
        <Button variant="outline" onClick={handleSaveEdit}>
         Save
        </Button>
        ) : (
        <Button variant="outline" onClick={() => handleEditClick(beam)}>
        Edit
        </Button>
        )}
        </td>
        <td><Button variant="destructive" 
        onClick={()=> beam._id && handleDelete(beam._id)}
        disabled={deleteMutaution.isPending}
        >{deleteMutaution.isPending ? "Deleting..." : "Delete"}</Button></td>
  </tr>
))}
      </tbody>
    </table>
  )
}