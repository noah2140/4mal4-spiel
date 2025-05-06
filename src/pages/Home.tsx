import React from 'react';
import ScreenShake from "../components/animations/ScreenShake";
import GameControls from '../components/game/GameControls';
import Tries from '../components/game/Tries';
import WordGrid from '../components/game/WordGrid';
import TopBar from '../components/layout/TopBar';
import Modals from '../components/shared/Modals';
import useAnimationController from '../hooks/useAnimationController';
import useGuessHandler from '../hooks/useGuessHandler';
import useModalManager from '../hooks/useModalManager';
import usePuzzleLoader from '../hooks/usePuzzleLoader';
import { useSwapHandler } from '../hooks/useSwapHandler';
import { useSwapPairs } from '../hooks/useSwapPairs';
import { loadOptions } from '../services/OptionsService';
import { fetchStatistics } from '../services/StatisticsService';
import { Puzzle } from '../types/Puzzle';
import './Home.css';

const Home: React.FC = () => {
    const {
        puzzles,
        currentPuzzle,
        progress,
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

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    const shouldShake = options.find((option) => option.name === "Wackeln bei Fehlversuchen")?.isOn;
    const [animatePairs, setAnimatePairs] = React.useState<[number, number][]>([]);

    const {
        showReportModal,
        showAboutModal,
        showStatisticsModal,
        showOptionsModal, 
        setShowStatisticsModal, 
        toggleModal,
    } = useModalManager();

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

    const { guessAnimationInProgress, animateTiles, startGuessAnimation } = useAnimationController();

    const shuffleArray = (array: string[]): string[] => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

    function mockDate(isoString: string) {
        const OriginalDate = Date;
        global.Date = class extends OriginalDate {
            constructor() {
                super();
                return new OriginalDate(isoString);
            }
        } as DateConstructor;
    }

    //mockDate('2025-03-24T00:00:00.000Z');

    React.useEffect(() => {
        setOptions(loadOptions());

        const isModalOpen = showModal || showReportModal || showAboutModal || showStatisticsModal || showOptionsModal;
        
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

            if (newRemainingWords.length === 0) {
                if (wordOrder.length > 0) {
                    setWordOrder([]);
                }
            } else {
                if (wordOrder.length === 0 || wordOrder.some((word) => !newRemainingWords.includes(word))) {
                    setWordOrder(newRemainingWords);
                }
            }
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [showModal, showReportModal, showAboutModal, showStatisticsModal, showOptionsModal, currentPuzzle, progress, wordOrder]);

    const filterPuzzles = (puzzles: Puzzle[]) => {
        const today = new Date().toISOString().split('T')[0];
        return puzzles.filter((puzzle) => puzzle.date <= today);
    };

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

    const swapPairs = useSwapPairs(wordOrder, selectedWords);

    const handleGuessWithAnimation = () => {
        const isAlreadyGuessed = (
            (currentPuzzle?.date && progress[currentPuzzle.date]?.falseTries?.some((attempt: string[]) => areArraysEqual(attempt, selectedWords))) ?? false
        );
    
        if (!isAlreadyGuessed) {
            const pairs = swapPairs;
            startGuessAnimation(selectedWords, () => handleGuess(pairs));
        } else {
            console.log('Diese Worte wurden bereits geraten');
        }
    };

    const calculateAnimationDelays = () => {
        const delays = selectedWords.map((_, index) => index * 0.1);
        return delays;
    };

    const gameOver = currentPuzzle
        ? progress[currentPuzzle.date]?.correctTries.length === 4
        : false;

    const handlePuzzleSelection = (date: string) => {
        handleSelectPuzzle(date);
        setSelectedWords([]);
    };

    return (
        <ScreenShake trigger={shake}>
            <div>
                <TopBar
                    onShowPuzzleModal={() => setShowModal(true)}
                    onShowReportModal={() => toggleModal('report')}
                    onShowAboutModal={() => toggleModal('about')}
                    onShowStatisticsModal={() => toggleModal('statistics')}
                    onShowOptionsModal={() => toggleModal('options')}
                    guessAnimationInProgress={guessAnimationInProgress}
                />

                <Modals
                    showModal={showModal}
                    showReportModal={showReportModal}
                    showAboutModal={showAboutModal}
                    showStatisticsModal={showStatisticsModal}
                    showOptionsModal={showOptionsModal}
                    puzzles={filterPuzzles(puzzles)}
                    progress={progress}
                    currentPuzzle={currentPuzzle}
                    statistics={statistics}
                    toggleModal={toggleModal}
                    handleSelectPuzzle={handlePuzzleSelection}
                    setShowModal={setShowModal}
                />

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
                            guessAnimationInProgress={guessAnimationInProgress}
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

                    <GameControls
                        onShuffle={shuffleDisplayedWords}
                        onDeselect={() => setSelectedWords([])}
                        onEnter={handleGuessWithAnimation}
                        isEnterDisabled={selectedWords.length < 4 || guessAnimationInProgress}
                        isShuffleDisabled={guessAnimationInProgress}
                        isDeselectDisabled={selectedWords.length < 1 || guessAnimationInProgress}
                        showResults={gameOver}
                        onShowResults={() => toggleModal('statistics')}
                    />
                        
                    </div>
                ) : (
                    <p>Seite bitte neu laden. Wenn diese Seite nach dem Neuladen immer noch da ist, ist aktuell kein neues Puzzle verfügbar. Alte Puzzle können weiterhin über den Knopf links oben ausgewählt werden.</p>
                )}
            </div>
        </ScreenShake>
    );
};

export default Home;

