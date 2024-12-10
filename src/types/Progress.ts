export interface PuzzleProgress {
    date: string;
    correctTries: { category: string; words: string[]; difficulty: number; }[];
    falseTries: string[][];
    tryOrder: number[];
    state: string;
}

export interface AllPuzzleProgress {
    [key: string]: PuzzleProgress;
}