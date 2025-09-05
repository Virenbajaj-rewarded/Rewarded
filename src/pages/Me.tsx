import { useEffect, useState } from 'react';
import { api } from '../api';
import type { MeResponse } from '../types/api';
import './Me.css';

export default function Me() {
    const [data, setData] = useState<MeResponse | null>(null);
    const [err, setErr] = useState<string>();

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get<MeResponse>('/users/me');
                setData(res.data);
            } catch (e) {
                if (e instanceof Error) setErr(e.message);
                else setErr('Unknown error');
            }
        })();
    }, []);

    if (err) {
        return (
            <div className="me-container error">
                <p>❌ {err}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="me-container loading">
                <p>⏳ Loading...</p>
            </div>
        );
    }

    return (
        <div className="me-container">
            <h2>My Profile</h2>
            <table>
                <tbody>
                <tr>
                    <th>Email</th>
                    <td>{data.email}</td>
                </tr>
                <tr>
                    <th>Phone</th>
                    <td>{data.phone ?? '—'}</td>
                </tr>
                <tr>
                    <th>Confirmed</th>
                    <td>{data.isPhoneConfirmed ? '✅ Yes' : '❌ No'}</td>
                </tr>
                <tr>
                    <th>Business</th>
                    <td>{data.businessName ?? '—'}</td>
                </tr>
                <tr>
                    <th>Address</th>
                    <td>{data.address ?? '—'}</td>
                </tr>
                <tr>
                    <th>Telegram</th>
                    <td>{data.tgUsername ?? '—'}</td>
                </tr>
                <tr>
                    <th>WhatsApp</th>
                    <td>{data.whatsppUsername ?? '—'}</td>
                </tr>
                <tr>
                    <th>Role</th>
                    <td>{data.role}</td>
                </tr>
                <tr>
                    <th>Created</th>
                    <td>{new Date(data.createdAt).toLocaleString()}</td>
                </tr>
                <tr>
                    <th>Updated</th>
                    <td>{new Date(data.updatedAt).toLocaleString()}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
