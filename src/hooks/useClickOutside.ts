import { useEffect } from 'react';

const useClickOutside = (ref: React.RefObject<HTMLElement | null>, onClose: () => void) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if ref.current exists and doesn't contain the event target
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener when the component is unmounted
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, onClose]);
};

export default useClickOutside;
