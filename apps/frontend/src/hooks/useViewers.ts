import { useEffect, useState } from 'react';
import socket from '@/lib/socket';
import type { MovieRef } from '@/types/movie';

export function useViewers(ref: MovieRef) {
    const [count, setCount] = useState(0);
    const roomId = `movie:${ref.source}:${ref.id}`;

    useEffect(() => {
        if (!socket.connected) socket.connect();

        socket.emit('join-movie', roomId);
        socket.on('viewer-count', setCount);

        return () => {
            socket.emit('leave-movie', roomId);
            socket.off('viewer-count', setCount);
        };
    }, [roomId]);

    return count;
}
