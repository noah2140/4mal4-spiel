const OPTIONS_KEY = "user-options";

const defaultOptions = [
    { name: 'Dark Mode', isOn: false },
    { name: 'Stärke der Versuche anzeigen', isOn: true },
    { name: 'Wackeln bei Fehlversuchen', isOn: true },
];

export const loadOptions = (): { name: string; isOn: boolean }[] => {
    try {
        const savedOptionsString = localStorage.getItem(OPTIONS_KEY);
        let savedOptions = savedOptionsString ? JSON.parse(savedOptionsString) : [];

        const updatedOptions = defaultOptions.map((defaultOption) => {
            const existingOption = savedOptions.find(
                (savedOption: { name: string; isOn: boolean }) => savedOption.name === defaultOption.name
            );
            return existingOption || defaultOption;
        });

        if (JSON.stringify(savedOptions) !== JSON.stringify(updatedOptions)) {
            localStorage.setItem(OPTIONS_KEY, JSON.stringify(updatedOptions));
        }

        return updatedOptions;
    } catch (error) {
        console.error('Failed to load options from localStorage:', error);
        return [...defaultOptions];
    }
};

export const saveOptions = (options: { name: string; isOn: boolean }[]): void => {
    localStorage.setItem(OPTIONS_KEY, JSON.stringify(options));
};
