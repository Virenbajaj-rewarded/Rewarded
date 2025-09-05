import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { phoneApi } from '../api/phone';
import { api } from '../api';
import type { MeResponse } from '../types/api';
import './PhoneVerify.css';

export default function PhoneVerify() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<MeResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const [phone, setPhone] = useState('+380');
    const [lockedPhone, setLockedPhone] = useState<string>();
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'enter' | 'code' | 'done'>('enter');
    const [error, setError] = useState<string>();
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get<MeResponse>('/users/me');
                setProfile(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        let t: number | undefined;
        if (cooldown > 0) {
            t = window.setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(t);
    }, [cooldown]);

    if (!user) return <div className="pv-wrapper">Login first</div>;
    if (loading) return <div className="pv-wrapper">Loading...</div>;

    if (profile?.isPhoneConfirmed) {
        return (
            <div className="pv-wrapper">
                <div className="pv-card">
                    <h2>Phone verification</h2>
                    <div className="pv-success">
                        ✅ Your phone <b>{profile.phone}</b> is already confirmed.
                    </div>
                </div>
            </div>
        );
    }

    const send = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(undefined);
        try {
            await phoneApi.send(phone);
            setLockedPhone(phone);
            setStep('code');
            setCooldown(30);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to send code');
        }
    };

    const resend = async () => {
        if (!lockedPhone) return;
        setError(undefined);
        try {
            await phoneApi.resend(lockedPhone);
            setCooldown(30);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to resend code');
        }
    };

    const verify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lockedPhone) return;
        setError(undefined);
        try {
            await phoneApi.verify(lockedPhone, code);
            setStep('done');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Invalid code');
        }
    };

    return (
        <div className="pv-wrapper">
            <div className="pv-card">
                <h2>Verify phone</h2>

                {step === 'enter' && (
                    <form onSubmit={send} className="pv-form">
                        <input
                            className="pv-input"
                            placeholder="+380XXXXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                        <button className="pv-btn" type="submit">
                            Send code
                        </button>
                    </form>
                )}

                {step === 'code' && (
                    <>
                        <form onSubmit={verify} className="pv-form">
                            <input
                                className="pv-input"
                                placeholder="6-digit code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                minLength={6}
                                maxLength={6}
                                inputMode="numeric"
                            />
                            <button className="pv-btn" type="submit">
                                Confirm
                            </button>
                        </form>
                        <button
                            className="pv-btn secondary"
                            onClick={resend}
                            disabled={cooldown > 0}
                        >
                            Resend {cooldown > 0 ? `(${cooldown})` : ''}
                        </button>
                    </>
                )}

                {step === 'done' && (
                    <div className="pv-success">✅ Phone verified 🎉</div>
                )}

                {error && <div className="pv-error">❌ {error}</div>}
            </div>
        </div>
    );
}
