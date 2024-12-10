import { useState } from 'react';
import { Puzzle, PuzzleCategory } from '../types/Puzzle';
import { PuzzleProgress } from '../types/Progress';
import { saveProgress } from '../services/ProgressService';
import { fetchStatistics, updateStatistics } from '../services/StatisticsService';
import { Statistics } from '../types/Statistics'

const MAX_FALSE_TRIES = 4;

const useGuessHandler = (
    currentPuzzle: Puzzle | null,
    progress: PuzzleProgress | null,
    updateProgress: (updatedProgress: PuzzleProgress) => void,
    triggerShake: () => void,
    shouldShake: boolean,
    setStatistics: (statistics: Statistics) => void,
    setShowStatisticsModal: (show: boolean) => void,
    setAnimatePairs: (pairs: [number, number][]) => void
) => {
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [correctTriesCount, setCorrectTriesCount] = useState<number>(0);
    const [falseTriesCount, setFalseTriesCount] = useState<number>(0);

    const statistics = fetchStatistics();

    const handleGuess = (pairs: [number, number][]) => {
        if (!currentPuzzle || selectedWords.length < 4) return;
    
        const correctCategory = currentPuzzle.categories.find((category: PuzzleCategory) =>
            category.words.every((word: string) => selectedWords.includes(word))
        );
    
        selectedWords.sort();
    
        let newProgress: PuzzleProgress;
    
        let updatedStats = { ...statistics };
    
        if (correctCategory) {
            setAnimatePairs(pairs);

            setTimeout(() => {
                const categoryIndex = currentPuzzle.categories.findIndex(
                    (cat) => cat.name === correctCategory.name
                );
                const difficulty = categoryIndex + 1;
        
                const newProgress = {
                    date: currentPuzzle.date,
                    correctTries: [
                        ...(progress?.correctTries || []),
                        { category: correctCategory.name, words: selectedWords, difficulty },
                    ],
                    falseTries: progress?.falseTries || [],
                    tryOrder: [...(progress?.tryOrder || []), 1],
                    state: "Gestartet",
                };
        
                setCorrectTriesCount(newProgress.correctTries.length);
        
                if (newProgress.correctTries.length === 4) {
                    newProgress.state = "Gelöst";
                    updatedStats.streak++;
                    updatedStats.nrSolved++;
                    updatedStats.nrAttempted++;
        
                    setShowStatisticsModal(true);
                }
        
                setSelectedWords([]);
        
                saveProgress(currentPuzzle.date, newProgress);
                updateProgress(newProgress);
                updateStatistics(updatedStats);
                setStatistics(updatedStats);
            }, 500); 
        } else {
            newProgress = {
                date: currentPuzzle.date,
                correctTries: progress?.correctTries || [],
                falseTries: [...(progress?.falseTries || []), selectedWords],
                tryOrder: [...(progress?.tryOrder || []), 0],
                state: "Gestartet",
            };
        
            setFalseTriesCount(newProgress.falseTries.length);
        
            if ((newProgress.falseTries.length ?? 0) >= MAX_FALSE_TRIES) {
                setSelectedWords([]);
                const existingCorrectCategoryNames = new Set(
                    (newProgress.correctTries || []).map((tryItem) => tryItem.category)
                );
    
                const categoriesToAdd = currentPuzzle.categories.filter(
                    (category) => !existingCorrectCategoryNames.has(category.name)
                );
        
                newProgress.correctTries = [
                    ...(newProgress.correctTries || []),
                    ...categoriesToAdd.map((category) => {
                        const categoryIndex = currentPuzzle.categories.findIndex(
                            (cat) => cat.name === category.name
                        );
                        return {
                            category: category.name,
                            words: category.words,
                            difficulty: categoryIndex + 1,
                        };
                    }),
                ];
        
                newProgress.state = "Nicht geschafft";
                updatedStats.streak = 0;
                updatedStats.nrAttempted++;
        
                setShowStatisticsModal(true);
            }
        
            if (shouldShake) {
                triggerShake();
            }
            saveProgress(currentPuzzle.date, newProgress);
            updateProgress(newProgress);
        
            updateStatistics(updatedStats);
            setStatistics(updatedStats);
        }
    };    

    return { handleGuess, selectedWords, setSelectedWords, correctTriesCount, falseTriesCount, statistics };
};

export default useGuessHandler;
