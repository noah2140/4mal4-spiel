import React, { useRef } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import { Puzzle } from '../../types/Puzzle';
import { AllPuzzleProgress } from '../../types/Progress';
import './PuzzleModal.css';

interface PuzzleModalProps {
    puzzles: Puzzle[];
    progress: AllPuzzleProgress;
    selectedPuzzle: string | null;
    onSelect: (date: string) => void;
    onClose: () => void;
}

const PuzzleModal: React.FC<PuzzleModalProps> = ({ puzzles, progress, selectedPuzzle, onSelect, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useClickOutside(modalRef, onClose);

    const reversedPuzzles = [...puzzles].reverse();

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                <div className="modal-entry">
                    <h2>Puzzle-Liste</h2>

                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <ul>
                    {reversedPuzzles.map((puzzle, index) => {
                        const puzzleProgress = progress[puzzle.date];
                        const puzzleState = puzzleProgress ? puzzleProgress.state : 'Noch nicht gestartet';

                        const correctTries = puzzleProgress?.correctTries.length || 0;

                        const correctTriesFormatted = `${correctTries}/4`;

                        const statusString = puzzleState === 'Gestartet'
                            ? `${puzzleState} (${correctTriesFormatted})`
                            : puzzleState;

                        const isSelected = selectedPuzzle === puzzle.date;

                        const displayIndex = puzzles.length - index;

                        return (
                            <li key={puzzle.date} className={isSelected ? 'selected-puzzle' : ''}>
                                <button className="puzzle-item" onClick={() => onSelect(puzzle.date)}>
                                    <p className="puzzleIndex">Puzzle #{displayIndex}</p>
                                    <p className="puzzleStatus">{statusString}</p>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default PuzzleModal;
