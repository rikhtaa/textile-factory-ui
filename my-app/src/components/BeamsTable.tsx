"use client"
import { deleteBeam, getAllQualities, updateBeam } from "@/http/api"
import { ApiErrorResponse, Beam, Quality } from "@/store"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { AxiosError } from "axios"

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
      onError: (error: AxiosError<ApiErrorResponse>) => {
        if (error.response?.status === 404) {
         toast.error("Beam have been already deleted");
        }else if(error.response && error.response.status >= 500){
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
       onError: (error: AxiosError<ApiErrorResponse>) => {
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
      const { data: qualitiesData } = useQuery({ queryKey: ['quality'], queryFn: getAllQualities })
      const QualitiesMap = new Map()
      qualitiesData?.data?.forEach((quality: Quality) => QualitiesMap.set(quality._id, quality.name))
      const qualities: Quality[] = qualitiesData?.data || []
    
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
    <div className="overflow-x-auto">
       <div className="m-3">
          <Button  onClick={()=> window.print()}>Download as PDF</Button>
       </div>
    <table className="w-full border-collapse border min-w-[800px] sm:min-w-0">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">Beam Number</th>
          <th className="border px-4 py-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">Total Meters</th>
          {/* <th className="border px-4 py-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">Quality</th> */}
          <th className="border px-4 py-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">Status</th>
          <th className="border px-4 py-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">Actions</th>
          <th className="border px-4 py-2 sm:p-3 text-left font-semibold text-xs sm:text-sm">Beam is less than 500</th>
        </tr>
      </thead>
      <tbody>
    {beams.map((beam, i) => (
      <tr key={beam._id || i} className="hover:bg-gray-50 even:bg-gray-50/50">
     <td className="border sm:p-3 p-2">
      <input 
        value={editingBeam?._id === beam._id ? editingBeam?.beamNumber : beam.beamNumber}
        onChange={(e) => editingBeam?._id === beam._id && 
          setEditingBeam(prev => prev ? { ...prev, beamNumber: e.target.value } : null)}
        className="px-2 py-1 border rounded text-xs sm:text-sm"
        readOnly={editingBeam?._id !== beam._id} 
      />
    </td>
    <td className="border sm:p-3 p-2">
      <input
        value={editingBeam?._id === beam._id ? editingBeam?.totalMeters : beam.totalMeters}
        onChange={(e) => editingBeam?._id === beam._id && 
          setEditingBeam(prev => prev ? { ...prev, totalMeters: Number(e.target.value) } : null)}
        className="w-full px-2 py-1 border rounded text-xs sm:text-sm"
        readOnly={editingBeam?._id !== beam._id}
      />
    </td>
    {/* <td className="border sm:p-3 p-2">
      <input
        value={editingBeam?._id === beam._id ? editingBeam?.quality : beam.quality}
        onChange={(e) => editingBeam?._id === beam._id && 
          setEditingBeam(prev => prev ? { ...prev, quality: e.target.value} : null)}
        className="w-full px-2 py-1 border rounded text-xs sm:text-sm"
        readOnly={editingBeam?._id !== beam._id}
      />
    </td> */}
    <td className="border sm:p-3 p-2">
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
     <td className="border p-2 sm:p-3">
       <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0">
         {editingBeam?._id === beam._id ? (
         <Button size="sm" className="text-xs sm:text-sm" variant="outline" onClick={handleSaveEdit}>
         Save
         </Button>
         ) : (
         <Button size="sm" className="text-xs sm:text-sm" variant="outline" onClick={() => handleEditClick(beam)}>
         Edit
         </Button>
         )}
         <Button size="sm" className="text-xs sm:text-sm" variant="destructive" 
         onClick={()=> beam._id && handleDelete(beam._id)}
         disabled={deleteMutaution.isPending}
         >{deleteMutaution.isPending ? "Deleting..." : "Delete"}</Button>
      </div>
     </td>
      { beam?.totalMeters < 500 &&
        (<td>
         <div>
          <Button size="sm" className="text-xs sm:text-sm" variant="destructive">
           Use another Beam
         </Button>
         </div>
      </td>)}
  </tr>
))}
      </tbody>
    </table>
    </div>
    </div>
  )
}