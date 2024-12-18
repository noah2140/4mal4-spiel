import React, { useRef, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import emailjs from "emailjs-com";
import { FaArrowLeft } from 'react-icons/fa';
import './ReportModal.css';

interface ReportModalProps {
    onClose: () => void;
}

const MAX_SUBMISSIONS_PER_DAY = 5;

const checkSubmissionLimit = (): boolean => {
    const today = new Date().toISOString().split('T')[0];
    const storedData = localStorage.getItem('submissionTracker');
    const tracker = storedData ? JSON.parse(storedData) : { date: '', count: 0 };

    if (tracker.date !== today) {
        localStorage.setItem(
            'submissionTracker',
            JSON.stringify({ date: today, count: 0 })
        );
        return false;
    }

    return tracker.count >= MAX_SUBMISSIONS_PER_DAY;
};

const incrementSubmissionCount = () => {
    const today = new Date().toISOString().split('T')[0];
    const storedData = localStorage.getItem('submissionTracker');
    const tracker = storedData ? JSON.parse(storedData) : { date: '', count: 0 };

    const updatedTracker = {
        date: today,
        count: tracker.count + 1,
    };

    localStorage.setItem('submissionTracker', JSON.stringify(updatedTracker));
};

const ReportModal: React.FC<ReportModalProps> = ({ onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [view, setView] = useState<'default' | 'lockout' | 'report' | 'suggest' | 'processing' | 'success'>('default');

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

    const isLockedOut = checkSubmissionLimit();

    React.useEffect(() => {
        if (isLockedOut) {
          setView('lockout');
        } else {
          setView('default');
        }
      }, [isLockedOut]);

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
        console.log(localStorage.getItem("submissionTracker"));

        if (checkSubmissionLimit()) {
            setStatus('Limit für heute erreicht.');
            return;
        }

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
                incrementSubmissionCount();
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

                {view === 'lockout' && (
                    <>
                        <div className="modal-entry">
                            <h2>Nachricht an Entwickler senden</h2>

                            <button className="close-button" onClick={onClose}>
                                &times;
                            </button>
                        </div>
                        <p>
                            Limit für heute erreicht. Ab morgen können erneut Puzzles, Kategorien und Problemmeldungen übermittelt werden.
                        </p>
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
                                onClick={() => setFormData({ ...formData, mode: 'puzzle' })}
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
                                                    value={formData.words[i]}
                                                    onChange={(e) => handleChange(e, i)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {formData.reportText.trim() === '' && (
                            <p className="error-message">Die Eingabe darf nicht leer sein.</p>
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
