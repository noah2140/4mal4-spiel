import React from 'react';
import { PuzzleProgress } from '../../types/Progress';

interface ProgressDisplayProps {
    progress: PuzzleProgress | null;
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ progress }) => {
    if (!progress) {
        return <p>No progress to display yet.</p>;
    }

    return (
        <div>
            <h2>Progress</h2>

            <h3>State</h3>
            <ul>
               { progress.state }
            </ul>

            <h3>Correct Tries</h3>
            <ul>
                {progress.correctTries.map((tryItem, index) => (
                    <li key={index}>
                        <strong>Category:</strong> {tryItem.category} <br />
                        <strong>Words:</strong> {tryItem.words.join(', ')} <br />
                        <strong>Difficulty:</strong> {tryItem.difficulty}
                    </li>
                ))}
            </ul>

            <h3>False Tries</h3>
            <ul>
                {progress.falseTries.map((words, index) => (
                    <li key={index}>
                        <strong>Words:</strong> {words.join(', ')}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProgressDisplay;
