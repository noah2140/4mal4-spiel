import React from 'react';

const useModalManager = () => {
    const [showReportModal, setShowReportModal] = React.useState(false);
    const [showAboutModal, setShowAboutModal] = React.useState(false);
    const [showStatisticsModal, setShowStatisticsModal] = React.useState(false);
    const [showOptionsModal, setShowOptionsModal] = React.useState(false);

    const toggleModal = (modalType: 'report' | 'about' | 'statistics' | 'options') => {
        if (modalType === 'report') setShowReportModal((prev) => !prev);
        if (modalType === 'about') setShowAboutModal((prev) => !prev);
        if (modalType === 'statistics') setShowStatisticsModal((prev) => !prev);
        if (modalType === 'options') setShowOptionsModal((prev) => !prev);
    };

    return {
        showReportModal,
        showAboutModal,
        showStatisticsModal,
        showOptionsModal,
        setShowAboutModal,
        setShowStatisticsModal,
        setShowOptionsModal,
        toggleModal,
    };
};

export default useModalManager;
