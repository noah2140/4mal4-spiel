import React, { useEffect, useRef, useState } from 'react';
import { Puzzle } from '../../types/Puzzle';
import { PuzzleProgress } from '../../types/Progress';
import './WordGrid.css';

export interface WordGridProps {
    puzzle: Puzzle;
    progress: PuzzleProgress | null;
    selectedWords: string[];
    setSelectedWords: React.Dispatch<React.SetStateAction<string[]>>;
    onGuess: () => void;
    remainingWords: string[];
    animateTiles: string[];
    animationDelays: number[];
    animatePairs: [number, number][];
}

interface SolvedCategory {
    category: string;
    difficulty: number;
}

const WordGrid: React.FC<WordGridProps> = ({
    puzzle,
    progress,
    selectedWords,
    setSelectedWords,
    remainingWords,
    animateTiles,
    animationDelays,
    animatePairs,
}) => {
    const [solvedCategories, setSolvedCategories] = useState<SolvedCategory[]>([]);
    const [tilePositions, setTilePositions] = useState<any[]>([]);
    const tileRefs = useRef<(HTMLButtonElement | null)[]>([] as (HTMLButtonElement | null)[]);
    const [fontSizes, setFontSizes] = useState<number[]>([]);
    const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'pc' | 'unknown'>('unknown');
    const [isPortrait, setIsPortrait] = useState(true);

    useEffect(() => {
        const checkDeviceType = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            setIsPortrait(height > width);

            if (width <= 480) {
                setDeviceType('mobile');
            } else if (width > 480 && width <= 650) {
                setDeviceType('mobile');
            } else if (width > 650 && width <= 1024) {
                setDeviceType('tablet');
            } else if (width > 1024) {
                setDeviceType('pc');
            } else {
                setDeviceType('unknown');
            }
        };

        checkDeviceType();

        window.addEventListener('resize', checkDeviceType);

        return () => {
            window.removeEventListener('resize', checkDeviceType);
        };
    }, []);

    const calculateFontSize = (word: string): number => {
        let baseSize: number;
        switch (deviceType) {
            case 'mobile':
                baseSize = 17;
                break;
            case 'tablet':
                baseSize = 22;
                break;
            case 'pc':
                baseSize = 24;
                break;
            default:
                baseSize = 17;
        }

        const maxLength = 5;
        return word.length > maxLength
            ? (baseSize * maxLength) / word.length
            : baseSize;
    };

    useEffect(() => {
        const sizes = remainingWords.map(calculateFontSize);
        setFontSizes(sizes);
    }, [remainingWords, deviceType]);

    useEffect(() => {
        if (progress) {
            const solvedCategories = progress.correctTries.map((tryItem) => ({
                category: tryItem.category,
                difficulty: tryItem.difficulty,
            }));
            setSolvedCategories(solvedCategories);
        }
    }, [progress]);

    const toggleWordSelection = (word: string) => {
        setSelectedWords((prevSelected) =>
            prevSelected.includes(word)
                ? prevSelected.filter((w) => w !== word)
                : [...prevSelected, word].slice(0, 4)
        );
    };

    const animateWordSwap = () => {
        animatePairs.forEach(([index1, index2]) => {
            const tile1 = tileRefs.current[index1];
            const tile2 = tileRefs.current[index2];

            if (tile1 && tile2) {
                const pos1 = tilePositions[index1];
                const pos2 = tilePositions[index2];

                tile1.style.transition = 'transform 0.5s ease';
                tile2.style.transition = 'transform 0.5s ease';
                tile1.style.transform = `translate(${pos2.left - pos1.left}px, ${pos2.top - pos1.top}px)`;
                tile2.style.transform = `translate(${pos1.left - pos2.left}px, ${pos1.top - pos2.top}px)`;

                setTimeout(() => {
                    tile1.style.transition = '';
                    tile2.style.transition = '';
                    tile1.style.transform = '';
                    tile2.style.transform = '';
    
                    const updatedPositions = [...tilePositions];
                    updatedPositions[index1] = pos2;
                    updatedPositions[index2] = pos1;
    
                    setTilePositions(updatedPositions);
                }, 500);
            }
        });
    };

    useEffect(() => {
        if (animatePairs.length > 0) {
            animateWordSwap();
        }
    }, [animatePairs]);

    useEffect(() => {
        if (tileRefs.current.length > 0) {
            const positions = tileRefs.current.map((tile) =>
                tile ? tile.getBoundingClientRect() : { top: 0, left: 0 }
            );
            setTilePositions(positions);
        }
    }, [remainingWords]);

    return (
        <div className="word-grid-container">
            {solvedCategories.map(({ category, difficulty }) => {
                const categoryData = puzzle.categories.find((cat) => cat.name === category);

                const categoryWords = categoryData ? categoryData.words.sort().join(', ') : '';

                return (
                    <div key={category} className={`solved-category difficulty-${difficulty}`}>
                        <h3>{category}</h3>
                        <p>{categoryWords}</p>
                    </div>
                );
            })}

            {remainingWords.map((word, index) => {
                const delay = animationDelays[selectedWords.indexOf(word)] || 0;

                return (
                    <button
                        key={index}
                        className={`word-tile ${selectedWords.includes(word) ? 'selected' : ''} ${
                            animateTiles.includes(word) ? 'animate' : ''
                        }`}
                        style={{ 
                            animationDelay: `${delay}s`,
                            fontSize: `${fontSizes[index]}px`
                        }}
                        ref={(el: HTMLButtonElement | null) => { tileRefs.current[index] = el; }}
                        onClick={() => toggleWordSelection(word)}
                    >
                        {word}
                    </button>
                );
            })}
        </div>
    );
};

export default WordGrid;
