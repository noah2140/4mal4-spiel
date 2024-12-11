import React from 'react';

interface GameControlsProps {
    onShuffle: () => void;
    onDeselect: () => void;
    onEnter: () => void;
    isEnterDisabled: boolean;
    isShuffleDisabled: boolean;
    isDeselectDisabled: boolean;
    showResults: boolean;
    onShowResults: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
    onShuffle,
    onDeselect,
    onEnter,
    isEnterDisabled,
    isShuffleDisabled,
    isDeselectDisabled,
    showResults,
    onShowResults,
}) => (
    <div id="buttons-container">
        {showResults ? (
            <button
                id="results-button"
                className="regular-button"
                onClick={onShowResults}
            >
                Ergebnisse
            </button>
        ) : (
            <>
                <button
                    id="shuffle-button"
                    className="regular-button"
                    onClick={onShuffle}
                    disabled={isShuffleDisabled}
                >
                    Mischen
                </button>

                <button
                    id="deselect-button"
                    className="regular-button"
                    onClick={onDeselect}
                    disabled={isDeselectDisabled}
                >
                    Auswahl löschen
                </button>

                <button
                    id="enter-button"
                    className="regular-button"
                    onClick={onEnter}
                    disabled={isEnterDisabled}
                >
                    Enter
                </button>
            </>
        )}
    </div>
);

export default GameControls;
