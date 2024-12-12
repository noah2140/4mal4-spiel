import React, { useRef } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import { Statistics } from '../../types/Statistics';
import { Puzzle } from '../../types/Puzzle';
import { PuzzleProgress } from '../../types/Progress';
import './StatisticsModal.css';

interface StatisticsModalProps {
    onClose: () => void;
    statistics: Statistics;
    progress: PuzzleProgress | null;
    currentPuzzle: Puzzle | null;
    puzzles: Puzzle[];
}

const StatisticsModal: React.FC<StatisticsModalProps> = ({ onClose, statistics, progress, currentPuzzle, puzzles }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useClickOutside(modalRef, onClose);

    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
        };

        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);

        return () => {
            window.removeEventListener("resize", checkIfMobile);
        };
    }, []);

    if (!currentPuzzle) {
        return <p>No puzzle selected.</p>;
    }

    const puzzleIndex = puzzles.findIndex(puzzle => puzzle.date === currentPuzzle.date);

    const getCategoryEmojis = (
        tryOrder: number[], 
        correctTries: string[][], 
        falseTries: string[][], 
        categories: { name: string, words: string[] }[]
    ) => {
        const categoryEmojis: string[] = ['🟨', '🟩', '🟦', '🟪'];
    
        let correctIndex = 0;
        let falseIndex = 0;
    
        let result: string[][] = [];
    
        for (let i = 0; i < tryOrder.length; i++) {
            let tryWords: string[] = [];
    
            if (tryOrder[i] === 0) {
                tryWords = falseTries[falseIndex++] || [];
            } else {
                tryWords = correctTries[correctIndex++] || [];
            }
    
            result[i] = [];
    
            for (let j = 0; j < tryWords.length; j++) {
                for (let k = 0; k < categories.length; k++) {
                    if (categories[k].words.includes(tryWords[j])) {
                        result[i][j] = categoryEmojis[k];
                        break;
                    }
                }
            }
        }
    
        return result;
    };
    
    const handleShare = (statisticsText: string) => {
        if (navigator.share) {
            navigator
                .share({
                    text: statisticsText,
                })
                .then(() => console.log('Shared successfully'))
                .catch((error) => console.error('Error sharing:', error));
        } else {
            navigator.clipboard
                .writeText(statisticsText)
                .catch((error) => console.error('Error copying text:', error));
        }
    };

    const generateStatisticsText = (): string => {
        if (!progress) return '';
        const emojis = getCategoryEmojis(
            progress.tryOrder,
            progress.correctTries.map((tryItem) => tryItem.words),
            progress.falseTries,
            currentPuzzle.categories
        );

        const emojiLines = emojis.map((line) => line.join('')).join('\n');

        return `4x4 Puzzle #${puzzleIndex + 1}\n(Aktuelle Serie: ${statistics.streak})\n${emojiLines}\n\nhttps://noah2140.github.io/4mal4-spiel`;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                <div className="modal-entry">
                    <h2>Statistiken</h2>

                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="stats-modal-content">
                    <div className="stats-bar">
                        <div className="stats-item">
                            <p className="stats-header">Aktuelle Serie</p>
                            <p className="stats-number"> {statistics.streak}</p>
                        </div>
                        <div className="stats-item">
                            <p className="stats-header">Gelöst</p>
                            <p className="stats-number"> {statistics.nrSolved + " / " + statistics.nrAttempted}</p>
                        </div>
                        <div className="stats-item">
                            <p className="stats-header">Lösungsrate</p>
                            <p className="stats-number">
                                {statistics.nrAttempted > 0 
                                    ? `${Math.round((statistics.nrSolved / statistics.nrAttempted) * 1000) / 10}%` 
                                    : "?%"
                                }
                            </p>
                        </div>
                    </div>
                    {progress && (progress.state === "Gelöst" || progress.state === "Nicht geschafft") && (
                        <div className="tries-display">
                            <p><strong>4x4</strong> - Puzzle #{puzzleIndex + 1}</p>
                            {progress.tryOrder.map((tryValue, index) => {
                                const emojis = getCategoryEmojis(
                                    progress.tryOrder, 
                                    progress.correctTries.map(tryItem => tryItem.words), 
                                    progress.falseTries, 
                                    currentPuzzle.categories
                                ); 
                                return (
                                    <div key={index} className="try-item">
                                        {emojis[index].map((emoji, idx) => (
                                            <span key={idx} role="img" aria-label="category-emoji">{emoji}</span>
                                        ))}
                                    </div>
                                );
                            })}
                            <button className="share-button regular-button" onClick={() => handleShare(generateStatisticsText())}>
                                {isMobile ? 'Teilen' : 'Ergebnisse kopieren'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatisticsModal;
