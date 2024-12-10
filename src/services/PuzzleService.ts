import { Puzzle } from '../types/Puzzle';
import { puzzles } from '../assets/puzzles';

const PUZZLE_STORAGE_KEY = 'puzzles';

export function savePuzzles(puzzles: Puzzle[]) {
    localStorage.setItem(PUZZLE_STORAGE_KEY, JSON.stringify(puzzles));
}

export function fetchPuzzles(): Puzzle[] {
    savePuzzles(puzzles);
    return puzzles;
}

export function fetchPuzzleByDate(date: string): Puzzle | null {
    const puzzles = fetchPuzzles();
    return puzzles.find((puzzle) => puzzle.date === date) || null;
}
