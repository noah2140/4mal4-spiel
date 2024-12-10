import React, { useRef } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import './AboutModal.css';

interface AboutModalProps {
    onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useClickOutside(modalRef, onClose);

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                <div className="modal-entry">
                    <h2>Info</h2>

                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="description-category">
                    <h3>Spielerklärung</h3>
                    <p>
                        Bei diesem Spiel geht es darum für die 16 gegebenen Wörter, 4 Kategorien mit je 4 Wörtern zu finden.
                        Diese Kategorien können sehr simpel sein, wie z. B. Synonyme für ein bestimmtes Wort, 
                        oder eine gemeinsame Eigenschaft. 
                        Jedoch gibt es auch kompliziertere Kategorien, wie z. B. Wörter, auf die ein bestimmtes Wort folgt, oder
                        verschiedene Worte dafür, was mit einem bestimmten Begriff gemeint sein kann.
                    </p>
                </div>
                <div className="description-category">
                    <h3>Beispiel</h3>
                    <p>
                        Angenommen, die gegebenen Wörter wären: Automobil, Mühle, Flasche, Gully, Bauer, 
                        Turm, Schach, Buch, König, Reibe, Sieb, Toilette, Presse, Dame, Topf, Fussball. 
                        Für solche Wörter würde die Lösung wie folgt aussehen:
                    </p>
                    <p>
                        - Schachfiguren: Bauer, Dame, König, Turm
                    </p>
                    <p>
                        - Küchengeräte: Mühle, Presse, Reibe, Sieb
                    </p>
                    <p>
                        - Haben Deckel: Flasche, Gully, Toilette, Topf
                    </p>
                    <p>
                        - _Klub: Automobil, Buch, Fussball, Schach
                    </p>
                </div>
                <div className="description-category">
                    <h3>Schwierigkeit der Kategorien</h3>
                    <p>
                        Die Schwierigkeiten sind so aufgebaut, dass es 'scheinbar' einfachere und schwerere Kategorien gibt.
                        Die Farben sind dabei nach Schwierigkeit aufsteigend: Gelb, Grün, Blau, Lila.
                    </p>
                    <p>
                        Da die Schwierigkeit jedoch sehr subjektiv sein kann, sollte man sich nicht verunsichern lassen, wenn das
                        beim Lösungsversuch anders aussieht.
                    </p>
                </div>
                <div className="description-category">
                    <h3>Stärke von Versuchen</h3>
                    <p>
                        Wenn ein Versuch getätigt wird, der nicht mit einer der Kategorien übereinstimmt, werden die Worte dieses
                        Versuchs oberhalb der Wörter und gelösten Kategorien in einem kleinen Kästchen angezeigt.
                    </p>
                    <p>Die Hintergrundfarbe steht dafür, wie nah der Tipp an einer der Kategorien lag.</p>
                    <p>Rot/Orange bedeutet: 3 der Wörter sind in ein und der selben Kategorie.</p>
                    <p>Grün bedeutet: 2 der Wörter sind in ein und der selben Kategorie.</p>
                    <p>Blau/Türkis bedeutet: Alle 4 Wörter sind in verschiedenen Kategorien.</p>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;
