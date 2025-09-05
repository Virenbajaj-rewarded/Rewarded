import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import './Login.css';

export default function Login() {
    const { signIn, signUp } = useAuth();
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState<string>();
    const navigate = useNavigate();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(undefined);
        try {
            if (mode === 'login') await signIn(email.trim(), pass);
            else await signUp(email.trim(), pass);
            navigate('/me');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Unknown error');
            }
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2>{mode === 'login' ? 'Sign in' : 'Create account'}</h2>

                <form onSubmit={onSubmit} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="login-input"
                    />
                    <input
                        type="password"
                        placeholder="Password (min 6 chars)"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        required
                        minLength={6}
                        className="login-input"
                    />

                    {error && <div className="login-error">❌ {error}</div>}

                    <button type="submit" className="login-btn">
                        {mode === 'login' ? 'Sign in' : 'Sign up'}
                    </button>
                </form>

                <button
                    type="button"
                    className="login-btn secondary"
                    onClick={() => setMode((m) => (m === 'login' ? 'signup' : 'login'))}
                >
                    Switch to {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
            </div>
        </div>
    );
}
