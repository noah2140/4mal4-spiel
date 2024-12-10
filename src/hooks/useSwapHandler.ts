import { useState } from 'react';

export const useSwapHandler = <T>() => {
    const [swappedArray, setSwappedArray] = useState<T[]>([]);

    const shuffleArray = (array: T[]): T[] => {
        const result = [...array];

        const numPairs = Math.floor(result.length / 2);

        const generatePairs = (size: number): [number, number][] => {
            const pairs: [number, number][] = [];
            const usedIndices = new Set<number>();
            while (pairs.length < size) {
                const idx1 = Math.floor(Math.random() * result.length);
                const idx2 = Math.floor(Math.random() * result.length);
                if (idx1 !== idx2 && !usedIndices.has(idx1) && !usedIndices.has(idx2)) {
                    pairs.push([idx1, idx2]);
                    usedIndices.add(idx1);
                    usedIndices.add(idx2);
                }
            }
            return pairs;
        };

        const pairs = generatePairs(numPairs);
        pairs.forEach(([i, j]) => {
            [result[i], result[j]] = [result[j], result[i]];
        });

        return result;
    };

    const performShuffle = (array: T[]) => {
        const shuffled = shuffleArray(array);
        setSwappedArray(shuffled);
        return shuffled;
    };

    return { swappedArray, performShuffle };
};
