import React from 'react';
import usePuzzleLoader from '../hooks/usePuzzleLoader';
import useGuessHandler from '../hooks/useGuessHandler';
import { useSwapHandler } from '../hooks/useSwapHandler';
import ProgressDisplay from '../components/game/ProgressDisplay';
import Tries from '../components/game/Tries';
import WordGrid from '../components/game/WordGrid';
import PuzzleModal from '../components/shared/PuzzleModal';
import TopBar from '../components/layout/TopBar';
import AboutModal from '../components/shared/AboutModal';
import StatisticsModal from '../components/shared/StatisticsModal';
import OptionsModal from '../components/shared/OptionsModal';
import { Puzzle } from '../types/Puzzle';
import ScreenShake from "../components/animations/ScreenShake";
import { loadOptions } from '../services/OptionsService';
import { fetchStatistics } from '../services/StatisticsService';
import './Home.css';

const Home: React.FC = () => {
    const {
        puzzles,
        currentPuzzle,
        progress,
        loadPuzzle,
        handleSelectPuzzle,
        setShowModal,
        showModal,
        handleProgressUpdate,
    } = usePuzzleLoader();

    const [shake, setShake] = React.useState(false);
    const [options, setOptions] = React.useState<{ name: string; isOn: boolean }[]>([]);
    const [statistics, setStatistics] = React.useState(fetchStatistics());
    const { performShuffle } = useSwapHandler<string>();
    const [remainingWords, setRemainingWords] = React.useState<string[]>([]);
    const [wordOrder, setWordOrder] = React.useState<string[]>([]);
    const [showAboutModal, setShowAboutModal] = React.useState(false);
    const [showStatisticsModal, setShowStatisticsModal] = React.useState(false);
    const [showOptionsModal, setShowOptionsModal] = React.useState(false);
    const [animateTiles, setAnimateTiles] = React.useState<string[]>([]);

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    const shouldShake = options.find((option) => option.name === "Wackeln bei Fehlversuchen")?.isOn;
    const [animatePairs, setAnimatePairs] = React.useState<[number, number][]>([]);

    const { handleGuess, selectedWords, setSelectedWords } = useGuessHandler(
        currentPuzzle,
        progress[currentPuzzle?.date || ''] || {},
        handleProgressUpdate,
        triggerShake,
        !!shouldShake,
        (updatedStats) => setStatistics(updatedStats),
        setShowStatisticsModal,
        setAnimatePairs
    );

    const shuffleArray = (array: string[]): string[] => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

    React.useEffect(() => {
        setOptions(loadOptions());

        const isModalOpen = showModal || showAboutModal || showStatisticsModal || showOptionsModal;
        
        if (isModalOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        if (currentPuzzle) {
            const solvedWords =
                progress[currentPuzzle.date]?.correctTries.flatMap((tryItem) => tryItem.words) || [];
            const puzzleWords = shuffleArray(currentPuzzle.categories.flatMap((category) => category.words));
            const newRemainingWords = puzzleWords.filter((word) => !solvedWords.includes(word));
            setRemainingWords(newRemainingWords);

            if (wordOrder.length === 0 || wordOrder.some((word) => !newRemainingWords.includes(word))) {
                setWordOrder(newRemainingWords);
            }
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [showModal, showAboutModal, showStatisticsModal, showOptionsModal, currentPuzzle, progress]);

    const filterPuzzles = (puzzles: Puzzle[]) => {
        const today = new Date().toISOString().split('T')[0];
        return puzzles.filter((puzzle) => puzzle.date <= today);
    };

    const resetSelectedWords = () => setSelectedWords([]);

    const shuffleDisplayedWords = () => {
        const shuffled = performShuffle(wordOrder);
        setWordOrder(shuffled);
    };

    const remainingTries = currentPuzzle ? 4 - progress[currentPuzzle.date].falseTries.length : 4;

    const areArraysEqual = (arr1: string[], arr2: string[]) => {
        if (arr1.length !== arr2.length) return false;
    
        const sortedArr1 = arr1.slice().sort();
        const sortedArr2 = arr2.slice().sort();
    
        return sortedArr1.every((item, index) => item === sortedArr2[index]);
    };

    const handleGuessWithAnimation = () => {
        const isAlreadyGuessed = (
            (currentPuzzle?.date && progress[currentPuzzle.date]?.falseTries?.some((attempt: string[]) => areArraysEqual(attempt, selectedWords))) ?? false
        );

        const pairs = createSolveSwapPairs();
    
        if (!isAlreadyGuessed) {
            setAnimateTiles(selectedWords);
    
            setTimeout(() => {
                handleGuess(pairs);
                setAnimateTiles([]);
            }, 1100);
        } else {
            console.log('These words have already been guessed');
        }
    };

    const calculateAnimationDelays = () => {
        const delays = selectedWords.map((_, index) => index * 0.07);
        return delays;
    };

    const createSolveSwapPairs = () => {

        let alreadySwapped = [false, false, false, false];

        for (let i=0; i<4; i++) {
            for (let j=0; j<4; j++) {
                if (wordOrder[i] === selectedWords[j]) {
                    alreadySwapped[i] = true;
                    break;
                }
            }
        }

        let pairs: [number, number][] = [];

        for (let i=4; i<wordOrder.length; i++) {
            for (let j=0; j<4; j++) {
                if (wordOrder[i] === selectedWords[j]) {
                    for (let k=0; k<4; k++) {
                        if (alreadySwapped[k] === false) {
                            alreadySwapped[k] = true;
                            pairs.push([i, k]);
                            break;
                        }
                    }
                }
            }
        }

        return pairs;
    };

    return (
        <ScreenShake trigger={shake}>
            <div>
                <TopBar
                    onShowPuzzleModal={() => setShowModal(true)}
                    onShowAboutModal={() => setShowAboutModal(true)}
                    onShowStatisticsModal={() => setShowStatisticsModal(true)}
                    onShowOptionsModal={() => setShowOptionsModal(true)}
                />

                {showModal && (
                    <PuzzleModal
                        puzzles={filterPuzzles(puzzles)}
                        progress={progress}
                        selectedPuzzle={currentPuzzle?.date || null}
                        onSelect={(date) => handleSelectPuzzle(date, resetSelectedWords)}
                        onClose={() => setShowModal(false)}
                    />
                )}

                {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)}/>}
                {showStatisticsModal && <StatisticsModal onClose={() => setShowStatisticsModal(false)} statistics={statistics} progress={currentPuzzle ? progress[currentPuzzle.date] || null : null} currentPuzzle={currentPuzzle} puzzles={puzzles} />}
                {showOptionsModal && <OptionsModal onClose={() => setShowOptionsModal(false)} />}

                {currentPuzzle ? (
                    <div id="main-container">
                        <Tries
                            falseTries={progress[currentPuzzle.date]?.falseTries || []}
                            categories={currentPuzzle.categories}
                        />

                        <WordGrid
                            puzzle={currentPuzzle}
                            progress={progress[currentPuzzle.date] || {}}
                            selectedWords={selectedWords}
                            setSelectedWords={setSelectedWords}
                            onGuess={handleGuessWithAnimation}
                            remainingWords={wordOrder || remainingWords}
                            animateTiles={animateTiles}
                            animationDelays={calculateAnimationDelays()}
                            animatePairs={animatePairs}
                        />

                        {progress[currentPuzzle.date].correctTries.length !== 4 && (
                            <div className="remaining-tries-container">
                                <p className="remaining-tries-text">Verbleibende Versuche:</p>
                                <div className="tries-bubbles">
                                    {Array.from({ length: remainingTries }).map((_, index) => (
                                        <div key={index} className="bubble"></div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div id="buttons-container">
                            {progress[currentPuzzle.date]?.state !== 'Gelöst' && progress[currentPuzzle.date]?.state !== 'Nicht geschafft' ? (
                                <>
                                    <button id="shuffle-button" className="regular-button" onClick={shuffleDisplayedWords}>
                                        Mischen
                                    </button>

                                    <button id="deselect-button" className="regular-button" onClick={() => setSelectedWords([])} disabled={selectedWords.length < 1}>
                                        Auswahl löschen
                                    </button>

                                    <button id="enter-button" className="regular-button" onClick={handleGuessWithAnimation} disabled={selectedWords.length < 4}>
                                        Enter
                                    </button>
                                </>
                            ) : (
                                <button
                                    id="results-button"
                                    className="regular-button"
                                    onClick={() => setShowStatisticsModal(true)}
                                >
                                    Ergebnisse
                                </button>
                            )}
                        </div>
                        
                    </div>
                ) : (
                    <p>No puzzle selected.</p>
                )}
            </div>
        </ScreenShake>
        
    );
};

export default Home;
