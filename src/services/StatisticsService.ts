import { Statistics } from '../types/Statistics';

const STATISTICS_STORAGE_KEY = 'user-statistics';

const DEFAULT_STATISTICS: Statistics = {
    streak: 0,
    nrSolved: 0,
    nrAttempted: 0,
};

export function resetStatistics(): void {
    saveStatistics(DEFAULT_STATISTICS);
}

export function fetchStatistics(): Statistics {
    try {
        const storedStatistics = localStorage.getItem(STATISTICS_STORAGE_KEY);
        return storedStatistics ? JSON.parse(storedStatistics) : DEFAULT_STATISTICS;
    } catch (error) {
        console.error('Failed to load statistics', error);
        return { streak: 0, nrSolved: 0, nrAttempted: 0 };
    }
}

export function saveStatistics(statistics: Statistics): void {
    try {
        localStorage.setItem(STATISTICS_STORAGE_KEY, JSON.stringify(statistics));
    } catch (error) {
        console.error('Failed to save statistics', error);
    }
}

export function updateStatistics(updatedStats: Partial<Statistics>): void {
    const currentStats = fetchStatistics();
    const newStats = { ...currentStats, ...updatedStats };

    saveStatistics(newStats);
}
