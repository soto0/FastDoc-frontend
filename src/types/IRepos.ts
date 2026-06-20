import type { IRoot } from './IRoot';

export interface IRepo {
    id: number;
    repo: string;
    owner: string;
}

export type ReposResponse = IRoot<IRepo[]>;
