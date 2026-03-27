import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '../../api/config';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const res = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                login(data.access_token);
                navigate('/admin/dashboard');
            } else {
                setError('Usuario o contraseña incorrectos');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded shadow max-w-sm w-full">
                <h2 className="text-2xl font-header font-bold mb-6 text-center uppercase">Admin Login</h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Usuario</label>
                        <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Contraseña</label>
                        <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded" />
                    </div>
                    <button type="submit" className="bg-black text-white font-bold py-3 mt-4 hover:bg-gray-800 transition">INGRESAR</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
