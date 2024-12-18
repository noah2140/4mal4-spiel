import React, { useEffect, useRef, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import { loadOptions, saveOptions } from '../../services/OptionsService';
import './OptionsModal.css';

interface OptionsModalProps {
    onClose: () => void;
}

const OptionsModal: React.FC<OptionsModalProps> = ({ onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useClickOutside(modalRef, onClose);

    const [options, setOptions] = useState(loadOptions());

    useEffect(() => {
        const loadedOptions = loadOptions();
        console.log("Loaded options:", loadedOptions);
        setOptions(loadedOptions);
    }, []);

    useEffect(() => {
        saveOptions(options);
    }, [options]);

    const handleToggle = (index: number) => {
        const newOptions = [...options];
        newOptions[index].isOn = !newOptions[index].isOn;
        setOptions(newOptions);
        saveOptions(newOptions);

        const themeMetaTag = document.querySelector('meta[name="theme-color"]');

        if (newOptions[index].name === 'Dunkelmodus') {
            if (newOptions[index].isOn) {
                document.body.classList.add('dark-mode');
                if (themeMetaTag) {
                    themeMetaTag.setAttribute('content', '#151b28');
                }
            } else {
                document.body.classList.remove('dark-mode');
                if (themeMetaTag) {
                    themeMetaTag.setAttribute('content', '#ffffff');
                }
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                <div className="modal-entry">
                    <h2>Einstellungen</h2>

                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <ul className="options-list">
                    {options.map((option, index) => (
                        <li key={index} className="option-item">
                            <span className="option-name">{option.name}</span>
                            <TogglePill isOn={option.isOn} onToggle={() => handleToggle(index)} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

interface TogglePillProps {
    isOn: boolean;
    onToggle: () => void;
}

const TogglePill: React.FC<TogglePillProps> = ({ isOn, onToggle }) => {
    return (
        <div className={`toggle-pill ${isOn ? 'on' : 'off'}`} onClick={onToggle}>
            <div className="toggle-circle">{isOn ? 'I' : 'O'}</div>
        </div>
    );
};

export default OptionsModal;
