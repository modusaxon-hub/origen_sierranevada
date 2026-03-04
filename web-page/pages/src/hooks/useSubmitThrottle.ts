import { useState } from 'react';

/**
 * Hook para throttle/cooldown en submits de formularios
 * Previene spam de múltiples clicks o doble-envío
 *
 * @param cooldownMs - Milisegundos de cooldown (default 3000 = 3s)
 * @returns { blocked: boolean, trigger: () => void }
 */
export const useSubmitThrottle = (cooldownMs = 3000) => {
    const [blocked, setBlocked] = useState(false);

    const trigger = () => {
        setBlocked(true);
        setTimeout(() => setBlocked(false), cooldownMs);
    };

    return { blocked, trigger };
};
