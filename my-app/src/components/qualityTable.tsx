"use client"
import { ApiErrorResponse, QualityResponse } from "@/store"
import { Button } from "./ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { deleteQuality, updateQuality } from "@/http/api"
import { AxiosError } from "axios"

export function QualityTable({ qualities }: { qualities: QualityResponse[] }) {
  const queryClient = useQueryClient()
  const [editingQuality, setEditingQuality] = useState<QualityResponse | null>(null)
  
  const deleteMutation = useMutation({
    mutationFn: deleteQuality,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quality'] })
      toast.success("Quality deleted successfully")
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      if (error.response?.status === 404) {
        toast.error("Quality already deleted")
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        toast.error("Network issue - please check your connection");
        return;
      }else {
        toast.error(error.response?.data?.message || error.message)
      }
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityResponse> }) => 
      updateQuality(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quality'] })
      setEditingQuality(null)
      toast.success("Quality updated successfully")
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      if (error.response?.status === 500) {
        toast.error("Server error. Please try again")
      }else if(error.response?.data?.message.includes('E11000')){
        toast.error("This Quality is already registered. Please use a different Quality Name.");
      } else {
        toast.error(error.response?.data?.message || error.message)
      }
    }
  })

  const handleDelete = (qualityId: string) => {
      deleteMutation.mutate(qualityId)
  }

  const handleEditClick = (quality: QualityResponse) => {
    setEditingQuality({ ...quality })
  }

  const handleSaveEdit = () => {
    if (editingQuality && editingQuality._id) {
      const { _id, ...updateData } = editingQuality
      updateMutation.mutate({ id: _id, data: updateData })
    }
  }

  const handleCancelEdit = () => {
    setEditingQuality(null)
  }

  const handleInputChange = (field: keyof QualityResponse, value: string | number) => {
    if (editingQuality) {
      setEditingQuality({ ...editingQuality, [field]: value })
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[600px] sm:min-w-0">
        <thead>
          <tr className="bg-gray-100">
            <th className="sm:p-3 text-left font-semibold text-xs sm:text-sm">Quality Name</th>
            <th className="sm:p-3 text-left font-semibold text-xs sm:text-sm">Price Meter</th>
            <th className="border p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm hidden md:table-cell">Price History</th>
            <th className="sm:p-3 text-left font-semibold text-xs sm:text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {qualities.map((quality) => (
            <tr key={quality._id} className="hover:bg-gray-50">
              <td className="border p-3 sm:p-3 text-sm">
                {editingQuality?._id === quality._id ? (
                  <input
                    value={editingQuality?.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm sm:text-base"
                  />
                ) : (
                  <span className="font-medium text-xs sm:text-sm">{quality.name}</span>
                )}
              </td>

              <td className="border p-2 sm:p-3 text-sm">
                {editingQuality?._id === quality._id ? (
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingQuality?.pricePerMeter}
                    onChange={(e) => handleInputChange('pricePerMeter', Number(e.target.value))}
                    className="w-full px-2 py-1 border rounded"
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                ) : (
                  <span  className="text-xs sm:text-sm">{Math.floor(quality.pricePerMeter)}</span>
                )}
              </td>

              <td className="border p-2 border p-2 sm:p-3 text-sm hidden md:table-cell">
                <div className="text-xs sm:text-sm text-gray-600">
                  {quality.priceHistory?.length > 0 ? (
                    <details>
                      <summary className="cursor-pointer text-blue-600">
                        {quality.priceHistory.length} price change(s)
                      </summary>
                      <div className="mt-2 space-y-1">
                        {quality.priceHistory.map((entry, index) => (
                          <div key={index} className="text-xs">
                            {Math.floor(entry.pricePerMeter)} from {" "}
                            {new Date(entry.effectiveFrom).toLocaleDateString()}
                          </div>
                        ))}
                      </div>
                    </details>
                  ) : (
                    "No history"
                  )}
                </div>
              </td>

              <td className="border p-2 sm:p-3">
                <div className="flex lex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0">
                  {editingQuality?._id === quality._id ? (
                    <>
                      <Button 
                        onClick={handleSaveEdit} 
                        size="sm"
                        className="text-xs sm:text-sm"
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleCancelEdit}
                        size="sm"
                        className="text-xs sm:text-sm"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => handleEditClick(quality)}
                      size="sm"
                      className="text-xs sm:text-sm"
                    >
                      Edit
                    </Button>
                  )}
                  
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDelete(quality._id!)}
                    disabled={deleteMutation.isPending}
                    size="sm"
                    className="text-xs sm:text-sm"
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {qualities.length === 0 && (
        <div className="p-4 sm:p-8 text-center text-gray-500 text-sm sm:text-base">
          No qualities found. Add your first quality above.
        </div>
      )}
      </div>
    </div>
  )
}