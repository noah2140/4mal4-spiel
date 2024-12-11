import React, { useState, useEffect } from 'react';
import { Puzzle } from '../types/Puzzle';
import { PuzzleProgress, AllPuzzleProgress } from '../types/Progress';
import { fetchPuzzles, fetchPuzzleByDate } from '../services/PuzzleService';
import { fetchProgress, saveProgress } from '../services/ProgressService';

const usePuzzleLoader = () => {
    const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
    const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
    const [progress, setProgress] = React.useState<AllPuzzleProgress>({});
    const [showModal, setShowModal] = useState(false);

    const handleProgressUpdate = (updatedProgress: PuzzleProgress) => {
        setProgress(prevProgress => ({
            ...prevProgress,
            [updatedProgress.date]: updatedProgress,
        }));
    };

    useEffect(() => {
        const loadedPuzzles = fetchPuzzles();
        setPuzzles(loadedPuzzles);

        const loadedProgress: AllPuzzleProgress = {};

        const lastOpenedPuzzleDate = localStorage.getItem('lastOpenedPuzzle');
        const storedToday = localStorage.getItem('today');
    
        const today = new Date().toISOString().split('T')[0];

        const puzzleDateToLoad = (storedToday === today) 
            ? (lastOpenedPuzzleDate || today) 
            : today;

        if (storedToday !== today) {
            localStorage.setItem('today', today);
        }

        const puzzle = fetchPuzzleByDate(puzzleDateToLoad);
        if (puzzle) {
            loadPuzzle(puzzle, false);
        }

        loadedPuzzles.forEach(puzzle => {
            const savedProgress = fetchProgress(puzzle.date);
            if (savedProgress) {
                loadedProgress[puzzle.date] = savedProgress;
            } else {
                loadedProgress[puzzle.date] = {
                    date: puzzle.date,
                    correctTries: [],
                    falseTries: [],
                    tryOrder: [],
                    state: "Noch nicht gestartet"
                };
            }
        });
        setProgress(loadedProgress);
    }, []);

    const handleSelectPuzzle = (date: string, resetSelectedWords?: () => void) => {
        const puzzle = fetchPuzzleByDate(date);
        if (puzzle) {
            loadPuzzle(puzzle, false, resetSelectedWords);
            localStorage.setItem('lastOpenedPuzzle', date); 
        }
        setShowModal(false);
    };

    const loadPuzzle = (puzzle: Puzzle, resetProgress = false, resetSelectedWords?: () => void) => {
        setCurrentPuzzle(puzzle);

        if (resetProgress) {
            saveProgress(puzzle.date, {
                date: puzzle.date,
                correctTries: [],
                falseTries: [],
                tryOrder: [],
                state: "Noch nicht gestartet"
            });

            setProgress(prevProgress => ({
                ...prevProgress,
                [puzzle.date]: {
                    date: puzzle.date,
                    correctTries: [],
                    falseTries: [],
                    tryOrder: [],
                    state: "Noch nicht gestartet"
                }
            }));

            return;
        }

        const loadedProgress = fetchProgress(puzzle.date);
        if (loadedProgress) {
            setProgress(prevProgress => ({
                ...prevProgress,
                [puzzle.date]: loadedProgress
            }));
        } else {
            setProgress(prevProgress => ({
                ...prevProgress,
                [puzzle.date]: {
                    date: puzzle.date,
                    correctTries: [],
                    falseTries: [],
                    tryOrder: [],
                    state: "Noch nicht gestartet"
                }
            }));
        }

        if (resetSelectedWords) {
            resetSelectedWords();
        }
    };

    return {
        puzzles,
        currentPuzzle,
        progress,
        loadPuzzle,
        handleSelectPuzzle,
        setShowModal,
        showModal,
        setProgress,
        handleProgressUpdate
    };
};

export default usePuzzleLoader;
