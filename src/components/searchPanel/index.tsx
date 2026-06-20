import type { FormEvent } from "react";
import type { IRepo } from "@/types/IRepos";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getChangelog } from "@/api/getChangelog";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "@/hooks/useSearchParams";
import { Button } from "../ui/button";
import Empty from "../ui/empty";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import RepoSearch from "./repoSearch";
import TagSelector from "./tagSelector";

const SearchPanel = () => {
  const { params, updateParams } = useSearchParams();
  const [open, setOpen] = useState(false);
  const [repo, setRepo] = useState<IRepo>();
  const [tag, setTag] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [changelog, setChangelog] = useState<string>();

  useEffect(() => {
    const { repo: repoParam, owner: ownerParam, tag: tagParam } = params;

    if (repoParam && ownerParam) {
      setRepo({ repo: repoParam, owner: ownerParam } as IRepo);
    } else {
      setRepo(undefined);
    }

    if (tagParam) {
      setTag(tagParam);
    } else {
      setTag(undefined);
      setChangelog(undefined);
    }

    if (repoParam && ownerParam && tagParam) {
      setIsLoading(true);

      getChangelog({ repo: repoParam, owner: ownerParam, tag: tagParam })
        .then((response) => setChangelog(response.changelog))
        .catch(() => console.error("error"))
        .finally(() => setIsLoading(false));
    }
  }, [params]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (repo == null || tag == null) return;

    updateParams({ repo: repo.repo, owner: repo.owner, tag });
  };

  return (
    <>
      <section className="search-section">
        <form
          className="search-form animate-slide-down"
          role="search"
          onSubmit={handleSubmit}
        >
          <FieldGroup className="flex flex-row items-end">
            <Field onClick={() => setOpen(true)}>
              <FieldLabel>Название пакета</FieldLabel>
              <Input
                placeholder="next.js, vue 3.5..."
                readOnly
                value={repo?.repo ?? ""}
                className="py-5"
              />
            </Field>
            <TagSelector
              repo={repo?.repo}
              owner={repo?.owner}
              tag={tag}
              setTag={setTag}
            />
            <Field className="w-fit">
              <Button
                type="submit"
                className="px-10 py-5 gap-2"
                size="icon-lg"
                disabled={repo == null || tag == null || isLoading}
              >
                <Search aria-hidden />
                Поиск
              </Button>
            </Field>
          </FieldGroup>
        </form>
        <Card className="result-card animate-slide-up">
          <CardContent className="result-content">
            {isLoading ? (
              <Spinner className="size-5 absolute left-0 right-0 mx-auto" />
            ) : changelog?.trim() != null ? (
              <div
                className="prose prose-sm prose-invert max-w-none 
                prose-headings:font-bold 
                prose-h2:text-emerald-400 prose-h2:mt-6 prose-h2:mb-4
                prose-h3:text-foreground prose-h3:mt-4
                prose-a:text-emerald-400 prose-a:hover:text-emerald-300
                prose-code:text-emerald-300 prose-code:bg-foreground/10 
                prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-foreground/5 prose-pre:rounded-lg
                prose-ul:my-3 prose-li:space-y-1.5 prose-li:text-gray-400"
              >
                <ReactMarkdown>{changelog}</ReactMarkdown>
              </div>
            ) : (
              <Empty />
            )}
          </CardContent>
        </Card>
      </section>
      <RepoSearch open={open} setOpen={setOpen} setRepo={setRepo} />
    </>
  );
};

export default SearchPanel;
