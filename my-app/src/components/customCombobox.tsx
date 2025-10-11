import { ChevronsUpDownIcon } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "./ui/button";

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
  items: { value: string | undefined; label: string }[];
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