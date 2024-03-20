import React, { useState, useEffect } from 'react';

interface UseKeyPressProps {
    historySize: number;
}

export default function UseKeyPress({ historySize }: UseKeyPressProps): Array<number> {
    const [kps, setKps] = useState<Array<number>>([]);

    function updateKps(e: any /* TODO: right type */) {
        const copy = [...kps, e.keyCode];
        while (copy.length > historySize) { 
            copy.unshift();
        }
        setKps(copy);
    }
    
    useEffect(() => {
        document.addEventListener('keydown', updateKps);
        return () => document.removeEventListener('keydown', updateKps);
    }, [kps]);

    return kps;
}
