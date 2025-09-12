"use client"
import { Factory, Loom } from "@/store"
import { Button } from "./ui/button"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteLooms, getAllFactories, updateLooms } from "@/http/api"
import { useEffect, useState } from "react"

export function LoomTable({ looms }: { looms: Loom[] }) {
   const queryClient = useQueryClient()
    const [editingLoom, setEditingLoom] = useState<Loom | null>(null)
      const [factories, setFactories] = useState<Factory[]>([])
  const deleteMutaution = useMutation({
    mutationFn: deleteLooms,
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey: ['loom']})
    }
  })

const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Loom> }) => 
    updateLooms(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loom'] })
      setEditingLoom(null)
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
    <table className="w-full border-collapse border">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2">Loom Number</th>
          <th className="border px-4 py-2">Factory</th>
          <th className="border px-4 py-2">Section</th>
          <th className="border px-4 py-2">Status</th>
          <th className="border px-4 py-2">Beam Info</th>
          <th className="border px-4 py-2">Update</th>
          <th className="border px-4 py-2">Delete</th>
        </tr>
      </thead>
       <tbody>
          {looms.map((w, i) => (
            <tr key={i}>
              <td className="border px-4 py-2">
                <input
                  value={editingLoom?._id === w._id ? editingLoom.loomNumber : w.loomNumber}
                  onChange={(e) => editingLoom?._id === w._id && 
                    setEditingLoom({ ...editingLoom, loomNumber: e.target.value })}
                  className="w-full border-none bg-transparent"
                  readOnly={editingLoom?._id !== w._id}
                />
              </td>
             <td className="border px-4 py-2">
              {editingLoom?._id === w._id ? (
                <select
                  value={editingLoom.factoryId}
                  onChange={(e) => editingLoom && 
                    setEditingLoom({ ...editingLoom, factoryId: e.target.value })}
                  className="w-full border rounded-md p-1"
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
                  className="w-full border-none bg-transparent"
                  readOnly={editingLoom?._id !== w._id}
                />
              </td>

              <td className="border px-4 py-2">
                <select
                  value={editingLoom?._id === w._id ? editingLoom.status : w.status}
                  onChange={(e) => editingLoom?._id === w._id && 
                    setEditingLoom({ ...editingLoom, status: e.target.value })}
                  className="w-full border-none bg-transparent"
                  disabled={editingLoom?._id !== w._id}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </td>

              <td className="border px-4 py-2">
                <input
                  value={editingLoom?._id === w._id ? editingLoom.beamInfo : w.beamInfo}
                  onChange={(e) => editingLoom?._id === w._id && 
                    setEditingLoom({ ...editingLoom, beamInfo: e.target.value})}
                  className="w-full border-none bg-transparent"
                  readOnly={editingLoom?._id !== w._id}
                />
              </td>
              
             
              <td className="border px-4 py-2">
                {editingLoom?._id === w._id ? (
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
