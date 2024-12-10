import { PuzzleProgress, AllPuzzleProgress } from '../types/Progress';

const PROGRESS_STORAGE_KEY = 'puzzleProgress';

export function fetchAllProgress(): AllPuzzleProgress {
    const storedProgress = localStorage.getItem('allPuzzleProgress');
    return storedProgress ? JSON.parse(storedProgress) : {};
}

export function saveAllProgress(progress: AllPuzzleProgress): void {
    localStorage.setItem('allPuzzleProgress', JSON.stringify(progress));
}

export function fetchProgress(date: string): PuzzleProgress | null {
    const allProgress = fetchAllProgress();
    return allProgress[date] || null;
}

export function saveProgress(date: string, progress: PuzzleProgress): void {
    const allProgress = fetchAllProgress();
    allProgress[date] = progress;
    saveAllProgress(allProgress); 
}

export function deleteProgress(date: string) {
    const storedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (storedProgress) {
        const allProgress = JSON.parse(storedProgress) as PuzzleProgress[];
        const updatedProgress = allProgress.filter((p) => p.date !== date);

        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updatedProgress));
    }
}
