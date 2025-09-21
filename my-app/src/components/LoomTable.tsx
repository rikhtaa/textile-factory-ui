"use client"
import { ApiErrorResponse, Factory, Loom } from "@/store"
import { Button } from "./ui/button"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteLooms, getAllFactories, updateLooms } from "@/http/api"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { AxiosError } from "axios"

export function LoomTable({ looms }: { looms: Loom[] }) {
   const queryClient = useQueryClient()
    const [editingLoom, setEditingLoom] = useState<Loom | null>(null)
      const [factories, setFactories] = useState<Factory[]>([])
  const deleteMutaution = useMutation({
    mutationFn: deleteLooms,
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey: ['loom']})
      toast.success("Loom removed successfully");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      if (error.response?.status === 404) {
       toast.error("Loom have been already deleted");
      }else if(error.response && error.response.status >= 500){
       toast.error("Internet issue please try again later");
      }
      else{
       toast.error(error.response?.data?.message || error.message);
      }
    }
  })

const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Loom> }) => 
    updateLooms(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loom'] })
      setEditingLoom(null)
        toast.success("User has been updated");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      if(error.response?.status === 500 ||error.response?.data?.message.includes('ENOTFOUND') || error.message?.includes('ENOTFOUND')){
        toast.error("No internet connection.")
      }else{
        toast.error(error.response?.data?.message || error.message );
      }
    }
  })

  

  const handleDelete = (loomId: string)=>{
    console.log('Deleting loom with ID:', loomId) 
    deleteMutaution.mutate(loomId)
  }
   const handleUpdate = (id: string, data: Partial<Loom>) => {
    updateMutation.mutate({ id, data })
  }

  const handleEditClick = (loom: Loom) => {
    setEditingLoom(loom)
  }

   const handleSaveEdit = () => {
    if (editingLoom) {
      const { _id, ...updateData } = editingLoom
      handleUpdate(_id, updateData)
    }
  }

  const { data: factoriesData } = useQuery({
    queryKey: ['factories'],
    queryFn: getAllFactories 
  })
   useEffect(() => {
    if (factoriesData?.data) {
      setFactories(factoriesData.data)
    }
  }, [factoriesData])

  const getFactoryNameById = (factoryId: string) => {
    const factory = factories.find(f => f._id === factoryId);
    return factory ? factory.name : factoryId; 
  };

  return (
    <div className="border rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
    <table className="w-full border-collapse min-w-[600px] sm:min-w-0">
      <thead>
        <tr className="bg-gray-100">
          <th className="sm:p-3 text-left font-semibold text-xs sm:text-sm">Loom Number</th>
          <th className="sm:p-3 text-left font-semibold text-xs sm:text-sm">Factory</th>
          <th className="sm:p-3 text-left font-semibold text-xs sm:text-sm">Section</th>
          <th className="sm:p-3 text-left font-semibold text-xs sm:text-sm">Status</th>
          <th className="sm:p-3 text-left font-semibold text-xs sm:text-sm">Beam Info</th>
          <th className="sm:p-3 text-left font-semibold text-xs sm:text-sm">Actions</th>
        </tr>
      </thead>
       <tbody>
          {looms.map((w, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border p-3 sm:p-3 text-sm">
                <input
                  value={editingLoom?._id === w._id ? editingLoom.loomNumber : w.loomNumber}
                  onChange={(e) => editingLoom?._id === w._id && 
                    setEditingLoom({ ...editingLoom, loomNumber: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-sm sm:text-base"
                  readOnly={editingLoom?._id !== w._id}
                />
              </td>
             <td className="border p-2 sm:p-3">
              {editingLoom?._id === w._id ? (
                <select
                  value={editingLoom.factoryId}
                  onChange={(e) => editingLoom && 
                    setEditingLoom({ ...editingLoom, factoryId: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-xs sm:text-sm"
                >
                  <option value="">Select Factory</option>
                  {factories.map(factory => (
                    <option key={factory._id} value={factory._id}>
                      {factory.name}
                    </option>
                  ))}
                </select>
              ) : (
                getFactoryNameById(w.factoryId)
              )}
            </td>
        
              <td className="border px-4 py-2">
                <input
                  value={editingLoom?._id === w._id ? editingLoom.section : w.section}
                  onChange={(e) => editingLoom?._id === w._id && 
                  setEditingLoom({ ...editingLoom, section: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-xs sm:text-sm"
                  readOnly={editingLoom?._id !== w._id}
                />
              </td>

              <td className="border p-2 sm:p-3">
                <select
                  value={editingLoom?._id === w._id ? editingLoom.status : w.status}
                  onChange={(e) => editingLoom?._id === w._id && 
                    setEditingLoom({ ...editingLoom, status: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-xs sm:text-sm"
                  disabled={editingLoom?._id !== w._id}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </td>

              <td className="border p-2 sm:p-3">
                <input
                  value={editingLoom?._id === w._id ? editingLoom.beamInfo : w.beamInfo}
                  onChange={(e) => editingLoom?._id === w._id && 
                    setEditingLoom({ ...editingLoom, beamInfo: e.target.value})}
                  className="w-full px-2 py-1 border rounded text-xs sm:text-sm"
                  readOnly={editingLoom?._id !== w._id}
                />
              </td>
              
             
              <td className="border p-2 sm:p-3">
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0"> 
                {editingLoom?._id === w._id ? (
                  <Button className="text-xs sm:text-sm" size="sm" variant="outline" onClick={handleSaveEdit}>
                    Save
                  </Button>
                ) : (
                  <Button className="text-xs sm:text-sm" size="sm" variant="outline" onClick={() => handleEditClick(w)}>
                    Edit
                  </Button>
                )}
              <Button className="text-xs sm:text-sm" size="sm" variant="destructive" 
            onClick={()=> handleDelete(w._id)}
            disabled={deleteMutaution.isPending}
            > {deleteMutaution.isPending ? "Deleting..." : "Delete"}</Button>
            </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </div>
  )
}
