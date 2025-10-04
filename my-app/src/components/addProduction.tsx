"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Beam, CreateProduction, Factory, Loom, LoomManagement, Quality, Worker } from "@/store"
import { useQuery } from "@tanstack/react-query"
import { getAllBeams, getAllFactories, getAllLoomManage, getAllQualities, getLooms, getWorkers } from "@/http/api"
import { ChevronsUpDownIcon } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Toaster } from "./ui/sonner"
import { toast } from "sonner"

interface AddProductionProps extends React.ComponentProps<"div"> {
  onFormSubmit?: (formData: CreateProduction) => void;
  onSucess: boolean | undefined
  isPending: boolean | undefined
  beamsData: Beam[]
}

export const CustomCombobox = ({
  value,
  onValueChange,
  items,
  placeholder,
  open,
  onOpenChange
}: {
  value: string;
  onValueChange: (value: string) => void
  items: { value: string; label: string }[];
  placeholder: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => (
  <Popover open={open} onOpenChange={onOpenChange}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between"
      >
        {value
          ? items.find((item) => item.value === value)?.label
          : placeholder}
        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-full p-0">
      <Command>
        <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {items?.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={(currentValue) => {
                  onValueChange(currentValue === value ? "" : currentValue)
                  onOpenChange(false)
                }}
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
)

export function AddProduction({
  className,
  onFormSubmit,
  isPending,
  onSucess,
  beamsData,
  ...props
}: AddProductionProps) {
  const [formData, setFormData] = useState<CreateProduction>({
    beamId: '',
    operatorId: '',
    factoryId: '',
    loomId: '',
    qualityId: '',
    loomManagement: '',
    date: new Date(),
    shift: '',
    meterProduced: undefined as unknown as number,
    notes: ''
  });

  const [openDropdowns, setOpenDropdowns] = useState({
    factory: false,
    operator: false,
    shift: false,
    loomManagement: false
  });

  const { data: factoriesData } = useQuery({ queryKey: ['factories'], queryFn: getAllFactories })
  const { data: operatorsData } = useQuery({ queryKey: ['workers'], queryFn: getWorkers })
  const { data: loomsManageData } = useQuery({ queryKey: ['loommanagement'], queryFn: getAllLoomManage })
  const { data: qualitiesData } = useQuery({ queryKey: ['quality'], queryFn: getAllQualities })
  const { data: loomsData } = useQuery({ queryKey: ['looms'], queryFn: getLooms })

  const factories: Factory[] = factoriesData?.data || []
  const allLooms: LoomManagement[] = loomsManageData?.data || []
  const workers: Worker[] = operatorsData?.data || []

  const LoomsMap = new Map()
  loomsData?.data?.forEach((loom: Loom) => LoomsMap.set(loom._id, loom.loomNumber))

  const BeamsMap = new Map()
  beamsData.forEach((beam: Beam) => BeamsMap.set(beam._id, beam.beamNumber))

  const QualitiesMap = new Map()
  qualitiesData?.data?.forEach((quality: Quality) => QualitiesMap.set(quality._id, quality.name))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { beamId, operatorId, factoryId, loomId, qualityId, shift } = formData;
    if (!beamId || !operatorId || !factoryId || !loomId || !qualityId || !shift) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (onFormSubmit) onFormSubmit(formData);

    setFormData({
      beamId: '',
      operatorId: '',
      factoryId: '',
      loomId: '',
      qualityId: '',
      loomManagement: '',
      date: new Date(),
      shift: '',
      meterProduced: Number( ),
      notes: ''
    });

  };
  return (
    <div className={cn("flex flex-col gap-6 sm:gap-6", className)} {...props}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Add Production</CardTitle>
          <Toaster />
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-4 sm:gap-6 w-full md:w-[80%] lg:w-[60%] xl:w-[50%]">
              
              <div className="grid gap-3">
                <Label htmlFor="factory">Factory</Label>
                <CustomCombobox
                  value={formData.factoryId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, factoryId: value }))}
                  items={factories.map(factory => ({ value: factory._id, label: factory.name }))}
                  placeholder="Select factory"
                  open={openDropdowns.factory}
                  onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, factory: open }))}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="operatorId">Operator</Label>
                <CustomCombobox
                  value={formData.operatorId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, operatorId: value }))}
                  items={workers.map(w => ({ value: w._id, label: w.name }))}
                  placeholder="Select operator"
                  open={openDropdowns.operator}
                  onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, operator: open }))}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="loomManagement">Loom Management</Label>
                <CustomCombobox
                  value={formData.loomManagement}
                  onValueChange={(value) => {
                    const selected = allLooms.find(l => l._id === value);
                    if (selected) {
                      setFormData(prev => ({
                        ...prev,
                        loomManagement: value,
                        loomId: selected.loom,
                        beamId: selected.beam,
                        qualityId: selected.quality
                      }));
                    }
                  }}
                  items={allLooms.map(l => ({
                    value: l._id,
                    label: `${LoomsMap.get(l.loom) || 'N/A'} | ${BeamsMap.get(l.beam) || 'N/A'} | ${QualitiesMap.get(l.quality) || 'N/A'}`
                  }))}
                  placeholder="Select Loom | Beam | Quality"
                  open={openDropdowns.loomManagement}
                  onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, loomManagement: open }))}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date.toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="shift">Shift</Label>
                <CustomCombobox
                  value={formData.shift}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, shift: value }))}
                  items={[
                    { value: 'A', label: 'Shift A' },
                    { value: 'B', label: 'Shift B' },
                    { value: 'C', label: 'Shift C' }
                  ]}
                  placeholder="Select shift"
                  open={openDropdowns.shift}
                  onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, shift: open }))}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="meterProduced">Meter Produced</Label>
                <Input
                  id="meterProduced"
                  type="number"
                  value={formData.meterProduced}
                  onChange={(e) => setFormData({ ...formData, meterProduced: Number(e.target.value) })}
                  onWheel={(e) => e.currentTarget.blur()}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full border rounded-md"
                />
              </div>

              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
