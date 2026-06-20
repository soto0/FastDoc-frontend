import type { IRoot } from './IRoot';

export interface IChangelog {
    changelog: string;
}

export type ChangelogResponse = IRoot<IChangelog>;
