import React from 'react';
import { FaQuestionCircle, FaChartBar, FaCog, FaEnvelopeOpenText, FaList } from 'react-icons/fa';
import './TopBar.css';

interface TopBarProps {
    onShowPuzzleModal: () => void;
    onShowReportModal: () => void;
    onShowAboutModal: () => void;
    onShowStatisticsModal: () => void;
    onShowOptionsModal: () => void;
    guessAnimationInProgress: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
    onShowPuzzleModal,
    onShowReportModal,
    onShowAboutModal,
    onShowStatisticsModal,
    onShowOptionsModal,
    guessAnimationInProgress,
}) => {
    return (
        <div className="top-bar">
            <button
                id="puzzle-list-button"
                onClick={() => { if (!guessAnimationInProgress) onShowPuzzleModal(); }}
                disabled={guessAnimationInProgress} 
            >
                <FaList size={20} />
            </button>

            <div id="right-modal-buttons">
                <button 
                    onClick={() => { if (!guessAnimationInProgress) onShowStatisticsModal();}}
                    disabled={guessAnimationInProgress} 
                >
                    <FaChartBar size={20} />
                </button>
                <button 
                    onClick={() => { if (!guessAnimationInProgress) onShowReportModal();}}
                    disabled={guessAnimationInProgress} 
                >
                    <FaEnvelopeOpenText size={20} />
                </button>
                <button 
                    onClick={() => { if (!guessAnimationInProgress) onShowAboutModal();}}
                    disabled={guessAnimationInProgress} 
                >
                    <FaQuestionCircle size={20} />
                </button>
                <button 
                    onClick={() => { if (!guessAnimationInProgress) onShowOptionsModal();}}
                    disabled={guessAnimationInProgress} 
                >
                    <FaCog size={20} />
                </button>
            </div>
        </div>
    );
};

export default TopBar;
