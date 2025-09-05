import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import Login from './pages/Login';
import PhoneVerify from './pages/PhoneVerify';
import Me from './pages/Me';
import { useAuth } from './auth/useAuth';
import type { ReactElement } from 'react';
import './App.css';

function Private({ children }: { children: ReactElement }) {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
    const { user, signOutApp } = useAuth();

    return (
        <BrowserRouter>
            <nav className="nav">
                {/* Левая часть: логотип + табы */}
                <div className="nav-left">
                    <div className="nav-logo">Rewarded</div>
                    <NavLink to="/me" className={({ isActive }) => (isActive ? 'tab active' : 'tab')}>
                        Me
                    </NavLink>
                    <NavLink to="/phone" className={({ isActive }) => (isActive ? 'tab active' : 'tab')}>
                        Phone
                    </NavLink>
                </div>

                {/* Правая часть: login/signout */}
                <div className="nav-right">
                    {user ? (
                        <button className="tab signout" onClick={signOutApp}>
                            Sign out
                        </button>
                    ) : (
                        <NavLink to="/login" className={({ isActive }) => (isActive ? 'tab active' : 'tab')}>
                            Login
                        </NavLink>
                    )}
                </div>
            </nav>

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/phone"
                    element={
                        <Private>
                            <PhoneVerify />
                        </Private>
                    }
                />
                <Route
                    path="/me"
                    element={
                        <Private>
                            <Me />
                        </Private>
                    }
                />
                <Route path="*" element={<Navigate to="/me" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
