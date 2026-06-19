import type { IRoot } from "./IRoot";

export interface IReleases {
  id: number;
  name: string;
  tag: string;
}

export interface IReleasesPage {
  releases: IReleases[];
  hasMore: boolean;
}

export type ReleasesResponse = IRoot<IReleases[]>;
