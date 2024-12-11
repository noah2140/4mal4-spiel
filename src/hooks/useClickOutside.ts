import { useEffect } from 'react';

const useClickOutside = (ref: React.RefObject<HTMLElement | null>, onClose: () => void) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, onClose]);
};

export default useClickOutside;
