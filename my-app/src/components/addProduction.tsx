"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCallback, useEffect, useState } from "react"
import { CreateProduction, Factory, Loom, Quality } from "@/store"
import { useQuery } from "@tanstack/react-query"
import { getAllFactories, getAllQualities, getLooms } from "@/http/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"


interface AddProductionProps extends React.ComponentProps<"div"> {
  onFormSubmit?: (formData: CreateProduction) => void;
}

export function AddProduction({
  className,
  onFormSubmit,
  ...props
}: AddProductionProps){
    const [filteredLooms, setFilteredLooms] = useState<Loom[]>([])
    const [filteredQualities, setFilteredQualities] = useState<Quality[]>([])
  const [formData, setFormData] = useState<CreateProduction>({
    operatorId: '',
    factoryId: '',
    loomId : '',
    qualityId : '',
    date: new Date(),
    shift : '',
    meterProduced: 0.1,
    notes: ''

  });

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  const productionData = {
    operatorId: formData.operatorId,
    loomId: formData.loomId,
    factoryId: formData.factoryId,
    qualityId: formData.qualityId,
    date: formData.date, 
    shift: formData.shift,
    meterProduced: formData.meterProduced,
    notes: formData.notes
  };

  if (onFormSubmit) {
    onFormSubmit(productionData);
  }

  setFormData({
    operatorId: '',
    loomId: '',
    factoryId: '',
    qualityId: '',
    date: new Date(),
    shift: '',
    meterProduced: 0.1,
    notes: ''
  });
};
  const { data: factoriesData } = useQuery({
    queryKey: ['factories'],
    queryFn: getAllFactories
  })

  const { data: loomsData } = useQuery({
    queryKey: ['looms'],
    queryFn: getLooms
  })

  const {data: qualitiesData}= useQuery({
      queryKey: ['quality'],
      queryFn: getAllQualities
  })

    const factories = factoriesData?.data || []
    const allLooms: Loom[] = loomsData?.data || []
    const qualities: Quality[] = qualitiesData?.data || []
  
    useEffect(() => {
      if (formData.factoryId) {
        setFilteredLooms(allLooms.filter(loom => loom.factoryId === formData.factoryId))
      } else {
        setFilteredLooms([])
      }
    }, [formData.factoryId, allLooms])
   const handleFactoryChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, factoryId: value, loomId: '' }));
  }, []);

  const handleLoomChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, loomId: value }));
  }, []);


  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add Production</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 w-[50%]">
              <div className="grid gap-3">
                <Label htmlFor="operatorId">Operator Id</Label>
                <Input
                  id="operatorId"
                  type="text"
                  placeholder="2321"
                  required
                  value={formData.operatorId}
                  onChange={(e) =>
                    setFormData({ ...formData, operatorId: e.target.value })
                  }
                />
              </div>

            <div className="grid gap-3">
            <Label htmlFor="factory">Factory</Label>
            <select
            id="factory"
            value={formData.factoryId}
            onChange={(e) => setFormData(prev => ({ ...prev, factoryId: e.target.value, loomId: '' }))}
            className="w-full border rounded-md p-2 px-3 py-2 text-sm"
            >
           <option value="">Select Factory</option>
            {factories.map((factory: any) => (
           <option key={factory._id} value={factory._id}>
           {factory.name}
            </option>
            ))}
  </select>
</div>

{formData.factoryId && (
  <div className="grid gap-3">
    <Label htmlFor="loom">Loom</Label>
    <select
      id="loom"
      value={formData.loomId}
      onChange={(e) => setFormData(prev => ({ ...prev, loomId: e.target.value }))}
      className="w-full border rounded-md p-2 px-3 py-2 text-sm"
    >
      <option value="">Select Loom</option>
      {filteredLooms.map((loom: Loom) => (
        <option key={loom._id} value={loom._id}>
          {loom.loomNumber} {loom.section && `- ${loom.section}`}
        </option>
      ))}
    </select>
  </div>
)}

              <div className="grid gap-3">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  placeholder="11-11-1111"
                  value={formData.date.toISOString().split('T')[0]}
                  onChange={(e) =>
                    setFormData({ ...formData, date: new Date(e.target.value) })
                  }
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="quality">Quality</Label>
                <select
                id="quality"
                value={formData.qualityId}
                onChange={(e) => setFormData(prev => ({ ...prev, qualityId: e.target.value }))}
                    className="w-full border rounded-md p-2 px-3 py-2 text-sm"
                >
                   <option value="">Select Quality</option>
                     {qualities.map((quality: Quality) => (
                     <option key={quality._id} value={quality._id}>
                       {quality.name}
                    </option>
                     ))}
                </select>
              </div>

              <div className="grid gap-3">
               <select
               value={formData.shift}
               onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
              >
              <option value="">Select Shift</option>
              <option value="A">Shift A</option>
              <option value="B">Shift B</option>
              <option value="C">Shift C</option>
             </select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="meterProduced">meterProduced</Label>
                <Input
                  id="meterProduced"
                  type="number"
                  placeholder="11.1"
                  required
                  value={formData.meterProduced}
                  onChange={(e) =>
                    setFormData({ ...formData, meterProduced: Number(e.target.value) })
                  }
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="notes">Notes</Label>
               <textarea
               id="notes"
              placeholder="Enter production notes, issues, observations..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full border rounded-md p-2"
              />
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Create
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}