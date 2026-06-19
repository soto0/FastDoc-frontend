import type { IRepo } from "@/types/IRepos";
import { useEffect, useState } from "react";
import { getRepos } from "@/api/getRepos";
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

interface RepoSearchParams {
  open: boolean;
  setOpen: (value: boolean) => void;
  setRepo: (value: IRepo) => void;
}

const RepoSearch = ({ open, setOpen, setRepo }: RepoSearchParams) => {
  const [query, setQuery] = useState("");
  const [repos, setRepos] = useState<IRepo[]>([]);

  useEffect(() => {
    if (query.length < 3) {
      setRepos([]);
      return;
    }

    const timer = setTimeout(async () => {
      const response = await getRepos(query);
      setRepos(response);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  const onSelect = (repo: IRepo) => {
    setRepo(repo);
    setOpen(false);
    setQuery("");
    setRepos([]);
  };

  return (
    <>
      <CommandDialog
        className="max-w-sm rounded-lg border"
        open={open}
        onOpenChange={setOpen}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Введите название пакета"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandGroup>
              {repos.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.owner}/${item.repo}`}
                  onSelect={() => onSelect(item)}
                >
                  <span className="text-xs text-muted-foreground">
                    {item.owner}
                  </span>
                  <span className="font-medium">{item.repo}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};

export default RepoSearch;
