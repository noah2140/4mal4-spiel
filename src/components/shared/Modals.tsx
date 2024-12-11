import React from 'react';
import PuzzleModal from './PuzzleModal';
import AboutModal from './AboutModal';
import StatisticsModal from './StatisticsModal';
import OptionsModal from './OptionsModal';
import { Puzzle } from '../../types/Puzzle';

interface ModalsProps {
    showModal: boolean;
    showAboutModal: boolean;
    showStatisticsModal: boolean;
    showOptionsModal: boolean;
    puzzles: Puzzle[];
    progress: Record<string, any>;
    currentPuzzle: Puzzle | null;
    statistics: any;
    toggleModal: (modalName: "about" | "statistics" | "options") => void;
    handleSelectPuzzle: (date: string, resetSelectedWords: () => void) => void;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modals: React.FC<ModalsProps> = ({
    showModal,
    showAboutModal,
    showStatisticsModal,
    showOptionsModal,
    puzzles,
    progress,
    currentPuzzle,
    statistics,
    toggleModal,
    handleSelectPuzzle,
    setShowModal,
}) => {
    return (
        <>
            {showModal && (
                <PuzzleModal
                    puzzles={puzzles}
                    progress={progress}
                    selectedPuzzle={currentPuzzle?.date || null}
                    onSelect={(date) => handleSelectPuzzle(date, () => {})}
                    onClose={() => setShowModal(false)}
                />
            )}

            {showAboutModal && <AboutModal onClose={() => toggleModal('about')} />}

            {showStatisticsModal && (
                <StatisticsModal
                    onClose={() => toggleModal('statistics')}
                    statistics={statistics}
                    progress={currentPuzzle ? progress[currentPuzzle.date] || null : null}
                    currentPuzzle={currentPuzzle}
                    puzzles={puzzles}
                />
            )}

            {showOptionsModal && <OptionsModal onClose={() => toggleModal('options')} />}
        </>
    );
};

export default Modals;
