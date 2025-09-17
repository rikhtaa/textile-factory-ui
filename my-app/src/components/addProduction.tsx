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
import { useEffect, useState, useMemo } from "react"
import { CreateProduction, Factory, Loom, Quality, Worker } from "@/store"
import { useQuery } from "@tanstack/react-query"
import { getAllFactories, getAllQualities, getLooms, getWorkers } from "@/http/api"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Toaster } from "./ui/sonner"
import { toast } from "sonner"

interface AddProductionProps extends React.ComponentProps<"div"> {
  onFormSubmit?: (formData: CreateProduction) => void;
  onSucess: boolean | undefined
  isPending: boolean | undefined
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
  onValueChange: (value: string) => void;
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
            {items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={(currentValue) => {
                  onValueChange(currentValue === value ? "" : currentValue)
                  onOpenChange(false)
                }}
              >
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
);

export function AddProduction({
  className,
  onFormSubmit,
  isPending, 
  onSucess, 
  ...props
}: AddProductionProps) {
  const [filteredLooms, setFilteredLooms] = useState<Loom[]>([])
  const [formData, setFormData] = useState<CreateProduction>({
    operatorId: '',
    factoryId: '',
    loomId: '',
    qualityId: '',
    date: new Date(),
    shift: '',
    meterProduced: Number(0),
    notes: ''
  });

  const [openDropdowns, setOpenDropdowns] = useState({
    operator: false,
    factory: false,
    loom: false,
    quality: false,
    shift: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (
    !formData.operatorId ||
    !formData.factoryId ||
    !formData.loomId ||
    !formData.qualityId ||
    !formData.shift
  ) {
    toast.error("Please fill in all required fields.");
    return;
  }
    
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
      meterProduced: Number(0),
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

  const { data: qualitiesData } = useQuery({
    queryKey: ['quality'],
    queryFn: getAllQualities
  })

  const { data: operatorsData } = useQuery({
    queryKey: ['workers'],
    queryFn: getWorkers
  })

  const factories: Factory[] = factoriesData?.data || []
  const allLooms: Loom[] = loomsData?.data || []
  const qualities: Quality[] = qualitiesData?.data || []
  const workers: Worker[] = operatorsData?.data || []

  const operators = useMemo(() => 
    workers.filter(worker => worker.role === 'operator'), 
    [workers]
  );

  useEffect(() => {
    if (formData.factoryId) {
      setFilteredLooms(allLooms.filter(loom => loom.factoryId === formData.factoryId))
    } else {
      setFilteredLooms([])
    }
  }, [formData.factoryId, allLooms])

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-full">
        <CardHeader className="flex justify-between">
          <CardTitle>Add Production</CardTitle>
          <Toaster />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 w-[50%]">
              <div className="grid gap-3">
                <Label htmlFor="operatorId">Operator</Label>
                <CustomCombobox
                  value={formData.operatorId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, operatorId: value }))}
                  items={operators.map(op => ({ value: op._id || 'unknown', label: op.name }))}
                  placeholder="Select operator"
                  open={openDropdowns.operator}
                  onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, operator: open }))}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="factory">Factory</Label>
                <CustomCombobox
                  value={formData.factoryId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, factoryId: value, loomId: '' }))}
                  items={factories.map(factory => ({ value: factory._id || 'unknown', label: factory.name }))}
                  placeholder="Select factory"
                  open={openDropdowns.factory}
                  onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, factory: open }))}
                />
              </div>

              {formData.factoryId && (
                <div className="grid gap-3">
                  <Label htmlFor="loom">Loom</Label>
                  <CustomCombobox
                    value={formData.loomId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, loomId: value }))}
                    items={filteredLooms.map(loom => ({ 
                      value: loom._id || 'unknown', 
                      label: `${loom.loomNumber}${loom.section ? ` - ${loom.section}` : ''}`
                    }))}
                    placeholder="Select loom"
                    open={openDropdowns.loom}
                    onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, loom: open }))}
                  />
                </div>
              )}

              <div className="grid gap-3">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date.toISOString().split('T')[0]}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, date: new Date(e.target.value) })
                  }
          
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="quality">Quality</Label>
                <CustomCombobox
                  value={formData.qualityId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, qualityId: value }))}
                  items={qualities.map(quality => ({ 
                    value: quality._id || 'unknown', 
                    label: quality.name 
                  }))}
                  placeholder="Select quality"
                  open={openDropdowns.quality}
                  onOpenChange={(open) => setOpenDropdowns(prev => ({ ...prev, quality: open }))}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="shift">Shift</Label>
                <CustomCombobox
                  value={String(formData.shift)}
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
                  placeholder="11.1"
                  required
                  value={formData.meterProduced}
                  onChange={(e) =>
                    setFormData({ ...formData, meterProduced: Number(e.target.value) })
                  }
                  onWheel={(e) => e.currentTarget.blur()}
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
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}