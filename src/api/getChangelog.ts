import type { ChangelogResponse, IChangelog } from "@/types/IChangelog";
import { apiClient } from "@/utils/apiClient";

interface IGetChangelogParams {
  repo: string;
  owner: string;
  tag: string;
}

export const getChangelog = async (
  params: IGetChangelogParams,
): Promise<IChangelog> => {
  const response = await apiClient.get<ChangelogResponse>("repos/changelog", {
    params,
  });

  return response.data.payload;
};
