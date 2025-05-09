import React, { useRef, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import emailjs from "emailjs-com";
import { FaArrowLeft } from 'react-icons/fa';
import './ReportModal.css';

interface ReportModalProps {
    onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [view, setView] = useState<'default' | 'report' | 'suggest' | 'processing' | 'success'>('default');

    const [formData, setFormData] = useState<{
        categoryName: string;
        words: string[];
        reportText: string;
        mode: string;
        [key: string]: any;
    }>({
        categoryName: '',
        words: ['', '', '', ''],
        reportText: '',
        mode: 'kategorie',
    });
    
    const [status, setStatus] = useState<string | null>(null);

    useClickOutside(modalRef, onClose);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index?: number
    ) => {
        if (index !== undefined) {
            const newWords = [...formData.words];
            newWords[index] = e.target.value;
            setFormData({ ...formData, words: newWords });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };
    
    const handleSubmit = (type: 'report' | 'suggest') => {
        setView('processing');
    
        let emailParams;
    
        if (type === 'report') {
            emailParams = { message: formData.reportText };
        } else {
            if (formData.mode === 'kategorie') {
                emailParams = {
                    categoryName: formData.categoryName,
                    words: formData.words.filter(Boolean).join(', '),
                };
            } else if (formData.mode === 'puzzle') {
                const categories = Array.from({ length: 4 }).map((_, j) => {
                    const categoryName = formData[`categoryName${j}`] || `Kategorie ${j + 1}`;
                    const words = Array.from({ length: 4 })
                        .map((_, i) => formData[`words${j}_${i}`] || '')
                        .filter(Boolean)
                        .join(', ');
    
                    return `${categoryName}: ${words}`;
                });
    
                emailParams = {
                    categoryName: 'Multiple Categories',
                    words: categories.join('\n'),
                };
            }
        }
    
        emailjs
            .send(
                "service_n9x10nb",
                type === 'report' ? "template_zsia6tc" : "template_8js0ws8",
                emailParams,
                "5we664aYY95Z9Mo01"
            )
            .then(() => {
                setStatus("Message sent successfully!");
                setFormData({ categoryName: '', words: ['', '', '', ''], reportText: '', mode: 'kategorie' });
                setView('success');
            })
            .catch(() => {
                setStatus("Failed to send message. Please try again later.");
                setView('success');
            });
    };    

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                {view === 'default' && (
                    <>
                        <div className="modal-entry">
                            <h2>Nachricht an Entwickler senden</h2>

                            <button className="close-button" onClick={onClose}>
                                &times;
                            </button>
                        </div>
                        <ul className="buttons-list">
                            <li>
                                <button onClick={() => setView('report')}>Problem melden</button>
                            </li>
                            <li>
                                <button onClick={() => setView('suggest')}>Kategorie / Puzzle vorschlagen</button>
                            </li>
                        </ul>
                    </>
                )}

                {view === 'report' && (
                    <>
                        <div className="modal-entry" id="report">
                            <button className="back-button" onClick={() => setView('default')}>
                                <FaArrowLeft /> 
                            </button>
                            <h2>Problem melden</h2>

                            <button className="close-button" onClick={onClose}>
                                &times;
                            </button>
                        </div>
                        <textarea
                            className="reportInput"
                            name="reportText"
                            placeholder="Beschreiben Sie das Problem..."
                            value={formData.reportText}
                            onChange={(e) => handleChange(e)}
                        />
                        {formData.reportText.trim() === '' && (
                            <p className="error-message">Das Feld darf nicht leer sein.</p>
                        )}
                        <button 
                            className="send-button" 
                            onClick={() => {
                                if (formData.reportText.trim() === '') {
                                    return;
                                }
                                handleSubmit('report');
                            }}
                        >
                            Senden
                        </button>
                    </>
                )}

                {view === 'suggest' && (
                    <>
                        <div className="modal-entry">
                            <button className="back-button" onClick={() => setView('default')}>
                                <FaArrowLeft />
                            </button>
                            <h2>Kategorie / Puzzle vorschlagen</h2>
                            <button className="close-button" onClick={onClose}>
                                &times;
                            </button>
                        </div>

                        <div className="switch-buttons">
                            <button
                                className={formData.mode === 'kategorie' ? 'active' : ''}
                                onClick={() => setFormData({ ...formData, mode: 'kategorie' })}
                            >
                                Kategorie
                            </button>
                            <button
                                className={formData.mode === 'puzzle' ? 'active' : ''}
                                onClick={() => {
                                    if (formData.mode === 'kategorie' && formData.categoryName.trim() !== '') {
                                        setFormData({
                                            ...formData,
                                            mode: 'puzzle',
                                        });
                                    } else {
                                        setFormData({ ...formData, mode: 'puzzle' });
                                    }
                                }}
                            >
                                Puzzle
                            </button>
                        </div>

                        {formData.mode === 'kategorie' && (
                            <>
                                <input
                                    name="categoryName"
                                    placeholder="Name der Kategorie"
                                    value={formData.categoryName}
                                    onChange={(e) => handleChange(e)}
                                />
                                <div className="word-grid">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <input
                                            key={i}
                                            placeholder={`Wort ${i + 1}`}
                                            value={formData.words[i]}
                                            onChange={(e) => handleChange(e, i)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {formData.mode === 'puzzle' && (
                            <>
                                {Array.from({ length: 4 }).map((_, j) => (
                                    <div key={j} className="kategorie-group">
                                        <input
                                            name={`categoryName${j}`}
                                            placeholder={`Name der Kategorie ${j + 1}`}
                                            value={formData[`categoryName${j}`] || ''}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    [`categoryName${j}`]: e.target.value,
                                                })
                                            }
                                        />
                                        <div className="word-grid">
                                            {Array.from({ length: 4 }).map((_, i) => (
                                                <input
                                                    key={i}
                                                    placeholder={`Kategorie ${j + 1} Wort ${i + 1}`}
                                                    value={formData[`words${j}_${i}`] || ''}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            [`words${j}_${i}`]: e.target.value,
                                                        })
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {formData.mode === 'kategorie' && (formData.categoryName.trim() === '' || formData.words.some(word => word.trim() === '')) && (
                            <p className="error-message">Kategorie-Name und Wörter dürfen nicht leer sein.</p>
                        )}

                        {formData.mode === 'puzzle' && 
                            Array.from({ length: 4 }).filter((_, j) => {
                                const categoryName = formData[`categoryName${j}`] || '';
                                const words = Array.from({ length: 4 })
                                    .map((_, i) => formData[`words${j}_${i}`] || '')
                                    .filter(Boolean); 
                                return categoryName.trim() !== '' && words.length === 4; 
                            }).length < 2 && (
                            <p className="error-message">Mindestens zwei Kategorien müssen einen Namen und vier Wörter enthalten.</p>
                        )}


                        <div className="suggest-buttons">
                            <button className="send-button" onClick={() => handleSubmit('suggest')}>Senden</button>
                        </div>
                    </>
                )}

                {view === 'processing' && (
                    <div className="temp-screen">
                        <h2>Nachricht wird übermittelt</h2>
                        <div className="progress-bar">
                            <div className="progress-bar-inner"></div>
                        </div>
                    </div>
                )}

                {view === 'success' && (
                    <>
                        <div className="temp-screen">
                            <h2>Erfolgreich übertragen</h2>
                            <p>Danke für den Beitrag zu 4x4</p>

                            <div className="success-buttons">
                                <button
                                    onClick={() => {
                                        setFormData({ categoryName: '', words: ['', '', '', ''], reportText: '', mode: 'kategorie' });
                                        setView('default');
                                    }}
                                >
                                    Weiteren Beitrag leisten
                                </button>
                                <button onClick={onClose}>Zurück zum Puzzle</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReportModal;
