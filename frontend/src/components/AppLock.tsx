'use client';

import { useState, useEffect } from 'react';
import { settingsAPI } from '@/lib/api';

export function AppLock({ children }: { children: React.ReactNode }) {
    // TEMPORARY BYPASS - Remove this line after setting up backend
    return <>{children}</>;

    const [isLocked, setIsLocked] = useState(true);
    const [pinSet, setPinSet] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pinInput, setPinInput] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        checkLockStatus();
    }, []);

    async function checkLockStatus() {
        try {
            // Check if PIN is configured in backend
            const { pin_set } = await settingsAPI.checkPin();
            setPinSet(pin_set);

            if (!pin_set) {
                setIsLocked(false); // No PIN set, unlock automatically
            } else {
                // Check local session
                const session = localStorage.getItem('app_unlocked');
                if (session === 'true') {
                    setIsLocked(false);
                }
            }
        } catch (err) {
            console.error('Lock check failed:', err);
            // Default to locked if error, but if backend is unreachable this might lock user out.
            // For safety in this "fix everything" mode, we'll keep it locked to prevent leak.
        } finally {
            setLoading(false);
        }
    }

    async function handleUnlock() {
        if (pinInput.length !== 4) {
            setError('Enter 4 digits');
            return;
        }

        try {
            setLoading(true);
            const { valid } = await settingsAPI.verifyPin(pinInput);
            if (valid) {
                localStorage.setItem('app_unlocked', 'true');
                setIsLocked(false);
            } else {
                setError('Incorrect PIN');
                setPinInput('');
            }
        } catch (err) {
            setError('Verification failed');
        } finally {
            setLoading(false);
        }
    }

    const handleKeyClick = (num: number) => {
        if (pinInput.length < 4) {
            setPinInput(prev => prev + num);
            setError('');
        }
    };

    const handleBackspace = () => {
        setPinInput(prev => prev.slice(0, -1));
        setError('');
    };

    if (loading) return <div className="page"><div className="loading"><div className="spinner"></div></div></div>;

    if (!isLocked) return <>{children}</>;

    return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <div className="container" style={{ maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔒</div>
                <h1 className="mb-lg">App Locked</h1>

                <div className="card">
                    <div className="input" style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '32px', marginBottom: '24px' }}>
                        {pinInput.padEnd(4, '•').replace(/./g, (char, i) => i < pinInput.length ? '●' : '○')}
                    </div>

                    {error && <p className="text-danger mb-md font-bold">{error}</p>}

                    <div className="numeric-pad">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <button key={num} className="numeric-key" onClick={() => handleKeyClick(num)}>{num}</button>
                        ))}
                        <button className="numeric-key" onClick={handleBackspace}>⌫</button>
                        <button className="numeric-key" onClick={() => handleKeyClick(0)}>0</button>
                        <button className="numeric-key action" onClick={handleUnlock}>➜</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
