import { useState } from 'react';

export default function useAnimationController() {
    const [guessAnimationInProgress, setGuessAnimationInProgress] = useState(false);
    const [animateTiles, setAnimateTiles] = useState<string[]>([]);

    const startGuessAnimation = (selectedWords: string[], callback: () => void) => {
        setGuessAnimationInProgress(true);
        setAnimateTiles(selectedWords);

        setTimeout(() => {
            callback();
            setAnimateTiles([]);
            setGuessAnimationInProgress(false);
        }, 1000);
    };

    return { guessAnimationInProgress, animateTiles, startGuessAnimation };
}