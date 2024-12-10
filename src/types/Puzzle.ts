export interface PuzzleCategory {
    name: string;
    words: string[];
}

export interface Puzzle {
    date: string;
    categories: PuzzleCategory[];
}
