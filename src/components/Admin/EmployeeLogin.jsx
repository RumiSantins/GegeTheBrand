import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '../../api/config';

const EmployeeLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, token, role } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            if (role === 'admin') navigate('/admin/dashboard');
            else navigate('/employee/dashboard');
        }
    }, [token, role, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                login(data.access_token);
                // Context's useEffect will handle navigation
            } else {
                setError('Usuario o contraseña incorrectos');
            }
        } catch (err) {
            setError('Error de conexión. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-header font-bold uppercase tracking-widest mb-2">Portal Empleado</h1>
                    <p className="text-gray-500 text-sm">Inicia sesión para gestionar pedidos</p>
                </div>
                
                {error && (
                    <div className="bg-red-50 text-red-500 p-3 mb-6 text-sm text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Usuario
                        </label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border-b-2 border-gray-200 p-2 focus:border-black outline-none transition-colors bg-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-b-2 border-gray-200 p-2 focus:border-black outline-none transition-colors bg-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white p-4 uppercase text-sm font-bold tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {loading ? 'Entrando...' : 'Ingresar'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t pt-6">
                    <p className="text-sm text-gray-500 mb-2">¿Es tu primera vez aquí?</p>
                    <Link to="/employee/register" className="text-sm font-bold uppercase tracking-wider border-b border-black pb-0.5 inline-block">
                        Completar Registro con DNI
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EmployeeLogin;
