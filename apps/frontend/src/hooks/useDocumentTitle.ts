import { useEffect } from 'react';

export function useDocumentTitle(title: string) {
    useEffect(() => {
        document.title = title ? `${title} — CineZone` : 'CineZone';
        return () => {
            document.title = 'CineZone';
        };
    }, [title]);
}
