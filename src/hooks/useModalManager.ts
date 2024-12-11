import React from 'react';

const useModalManager = () => {
    const [showAboutModal, setShowAboutModal] = React.useState(false);
    const [showStatisticsModal, setShowStatisticsModal] = React.useState(false);
    const [showOptionsModal, setShowOptionsModal] = React.useState(false);

    const toggleModal = (modalType: 'about' | 'statistics' | 'options') => {
        if (modalType === 'about') setShowAboutModal((prev) => !prev);
        if (modalType === 'statistics') setShowStatisticsModal((prev) => !prev);
        if (modalType === 'options') setShowOptionsModal((prev) => !prev);
    };

    return {
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
