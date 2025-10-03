"use client"
import {ApiErrorResponse, Beam, DataTypes, Loom, LoomManagement, Quality } from "@/store"
import { Input } from "./ui/input"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteLoomManage } from "@/http/api"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { AxiosError } from "axios"

export function LoomsManagement({ loomsManageData, beamsData,  qualitiesData, loomsData }: DataTypes) {
     const queryClient = useQueryClient()
     //so through the foreach set all the key value pair through Map to put into the map used set and to get the value. used get passed the key and got the value
     const LoomsMap = new Map()
     loomsData.forEach((loom: Loom)=>{
     LoomsMap.set(loom._id,loom.loomNumber)
     })
   
     const BeamsMap = new Map()
     beamsData.forEach((beam: Beam)=>{
       BeamsMap.set(beam._id,beam.beamNumber)
     })
   
     const QualitiesMap = new Map()
     qualitiesData.forEach((quality: Quality)=>{
       QualitiesMap.set(quality._id, quality.name)
     })

     const deleteMutaution = useMutation({
      mutationKey: ['loommanagement'],
      mutationFn: deleteLoomManage,
      onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey: ['loommanagement']})
        toast.success("Loom removed successfully");
      },onError: (error: AxiosError<ApiErrorResponse>) => {
            if (error.response?.status === 404) {
             toast.error("Woker have been already deleted");
            }else if(error.response && error.response.status >= 500){
             toast.error("Internet issue please try again later");
            }
            else{
             toast.error(error.response?.data?.message || error.message);
            }
          }
     })

      const handleDelete = (Id: string)=>{
       deleteMutaution.mutate(Id)
      }
  return (
    <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px] sm:min-w-0">
            <thead>
               <tr className="bg-gray-100">
                <th className="sm:p-3 text-left font-semibold text-xs sm:text-sm">Loom Number</th>
                <th className="sm:p-3 text-left font-semibold text-xs sm:text-sm">Factory</th>
                <th className="sm:p-3 text-left font-semibold text-xs sm:text-sm">Status</th>
                <th className="sm:p-3 text-left font-semibold text-xs sm:text-sm">Actions</th>
               </tr>
            </thead>
          <tbody>
          {loomsManageData?.map((loom : LoomManagement) => (
            <tr key={loom._id} className="hover:bg-gray-50">
              <td className="border p-3 sm:p-3 text-sm">
                <Input
                  value={LoomsMap.get(loom.loom) || loom.loom}
                  className="w-full px-2 py-1 border rounded text-sm sm:text-base"
                />
              </td>
              <td className="border p-3 sm:p-3 text-sm">
                <Input
                  value={BeamsMap.get(loom.beam)}
                  className="w-full px-2 py-1 border rounded text-sm sm:text-base"
                />
              </td>
              <td className="border p-3 sm:p-3 text-sm">
                <Input
                  value={QualitiesMap.get(loom.quality)}
                  className="w-full px-2 py-1 border rounded text-sm sm:text-base"
                />
              </td>
              <td className="border p-3 sm:p-3 text-sm">
                <Input
                  value={new Date(loom.beamDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                   day: "numeric",
                  })}
                  className="w-full px-2 py-1 border rounded text-sm sm:text-base"
                />
              </td>
              <td className="border p-2 sm:p-3">
                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0"> 
                  {/* {loom?._id === loom._id ? (
                    <Button className="text-xs sm:text-sm" size="sm" variant="outline" onClick={handleSaveEdit}>
                      Save
                    </Button>
                      ) : (
                   <Button className="text-xs sm:text-sm" size="sm" variant="outline" onClick={() => handleEditClick(w)}>
                     Edit
                   </Button>
                  )} */}
                   <Button className="text-xs sm:text-sm" size="sm" variant="destructive" 
                    onClick={()=> handleDelete(loom._id)}
                    disabled={deleteMutaution.isPending}
                    > 
                      {deleteMutaution.isPending ? "Deleting..." : "Delete"}
                   </Button>
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
