import React from 'react';
import { FaQuestionCircle, FaChartBar, FaCog, FaEnvelopeOpenText, FaList } from 'react-icons/fa';
import './TopBar.css';

interface TopBarProps {
    onShowPuzzleModal: () => void;
    onShowReportModal: () => void;
    onShowAboutModal: () => void;
    onShowStatisticsModal: () => void;
    onShowOptionsModal: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
    onShowPuzzleModal,
    onShowReportModal,
    onShowAboutModal,
    onShowStatisticsModal,
    onShowOptionsModal,
}) => {
    return (
        <div className="top-bar">
            <button
                id="puzzle-list-button"
                onClick={onShowPuzzleModal}
            >
                <FaList size={20} />
            </button>

            <div id="right-modal-buttons">
                <button onClick={onShowAboutModal}>
                    <FaQuestionCircle size={20} />
                </button>
                <button onClick={onShowStatisticsModal}>
                    <FaChartBar size={20} />
                </button>
                <button onClick={onShowOptionsModal}>
                    <FaCog size={20} />
                </button>
                <button onClick={onShowReportModal}>
                    <FaEnvelopeOpenText size={20} />
                </button>
            </div>
        </div>
    );
};

export default TopBar;
