import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useReleases } from "@/hooks/useReleasesSelector";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Field, FieldLabel } from "../ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface TagSelectorParams {
  repo?: string;
  owner?: string;
  tag?: string;
  setTag: (tag: string | undefined) => void;
}

const TagSelector = ({ repo, owner, setTag, tag }: TagSelectorParams) => {
  const [open, setOpen] = useState(false);
  const {
    selected,
    releases,
    isLoading,
    listRef,
    handleScroll,
    selectRelease,
  } = useReleases({ repo, owner, open, setOpen, setTag, tag });

  return (
    <Field className="w-[300px]">
      <FieldLabel>Версия</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={repo == null || owner == null}
            className={cn(
              "w-full justify-between py-5 font-normal",
              !selected && "text-muted-foreground",
            )}
          >
            <span className="truncate">
              {selected?.name ?? "Выберите версию"}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0"
          align="start"
        >
          <Command>
            <CommandList ref={listRef} onScroll={handleScroll}>
              <CommandEmpty>
                {isLoading ? "Загрузка..." : "Ничего не найдено"}
              </CommandEmpty>
              <CommandGroup>
                {releases.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.tag}
                    keywords={[item.name]}
                    onSelect={() => selectRelease(item)}
                  >
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              {isLoading && releases.length > 0 && (
                <p className="py-2 text-center text-xs text-muted-foreground">
                  Загрузка...
                </p>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Field>
  );
};

export default TagSelector;
