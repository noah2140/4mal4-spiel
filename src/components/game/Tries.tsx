import React from 'react';
import { loadOptions } from '../../services/OptionsService';
import './Tries.css';

interface TriesProps {
    falseTries: string[][];
    categories: { name: string; words: string[] }[];
}

const Tries: React.FC<TriesProps> = ({ falseTries, categories }) => {

    const [options, setOptions] = React.useState<{ name: string; isOn: boolean }[]>([]);

    const showTryStrength = options.find((option) => option.name === "Stärke der Versuche anzeigen")?.isOn;

    const getCommonWordsCount = (guess: string[], categoryWords: string[]): number => {
        const commonWords = guess.filter(word => categoryWords.includes(word));
        return commonWords.length;
    };

    const getGuessClass = (commonCount: number): string => {
        if (commonCount === 3) {
            return 'very-close';
        } else if (commonCount === 2) {
            return 'close';
        } else if (commonCount === 1){
            return 'far-off';
        } else {
            return 'not-defined';
        }
    };

    React.useEffect(() => {
        setOptions(loadOptions());
    }, []);

    return (
        <div className="tries-grid">
            {falseTries.map((falseTry, index) => {

                let maxCommonCount = 0;
                if(showTryStrength) {
                    categories.forEach((category) => {
                        const commonCount = getCommonWordsCount(falseTry, category.words);
                        if (commonCount > maxCommonCount) {
                            maxCommonCount = commonCount;
                        }
                    });
                }

                const bestMatchClass = getGuessClass(maxCommonCount);

                return (
                    <div key={index} className={`grid-item ${bestMatchClass} filled`}>
                        {falseTry.join(', ')}
                    </div>
                );
            })}
        </div>
    );
};

export default Tries;