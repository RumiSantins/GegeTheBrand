import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../../api/config';

const EmployeeRegister = () => {
    const [formData, setFormData] = useState({
        dni: '',
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/employee/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess('Registro completado con éxito. Ahora puedes iniciar sesión.');
                setTimeout(() => navigate('/employee/login'), 2000);
            } else {
                const data = await response.json();
                setError(data.detail || 'Error en el registro. Verifica tu DNI o elige otro usuario.');
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
                    <h1 className="text-3xl font-header font-bold uppercase tracking-widest mb-2">Completar Registro</h1>
                    <p className="text-gray-500 text-sm">Valida tu DNI para crear tu acceso</p>
                </div>
                
                {error && (
                    <div className="bg-red-50 text-red-500 p-3 mb-6 text-sm text-center border border-red-100">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 text-green-600 p-3 mb-6 text-sm text-center border border-green-100 font-bold">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            DNI
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Tu DNI previamente autorizado"
                            value={formData.dni}
                            onChange={(e) => setFormData({...formData, dni: e.target.value})}
                            className="w-full border-b-2 border-gray-200 p-2 focus:border-black outline-none transition-colors bg-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Elige un Usuario
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Ej: ana123"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            className="w-full border-b-2 border-gray-200 p-2 focus:border-black outline-none transition-colors bg-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Crea una Contraseña
                        </label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full border-b-2 border-gray-200 p-2 focus:border-black outline-none transition-colors bg-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !!success}
                        className="w-full bg-black text-white p-4 uppercase text-sm font-bold tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {loading ? 'Procesando...' : 'Registrarme'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t pt-6">
                    <Link to="/employee/login" className="text-sm font-bold uppercase tracking-wider border-b border-black pb-0.5 inline-block">
                        Volver al Inicio de Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EmployeeRegister;
