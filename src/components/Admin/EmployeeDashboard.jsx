import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import OrdersTab from './OrdersTab';
import { ShoppingCart } from 'lucide-react';

const EmployeeDashboard = () => {
    const { token, role, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/employee/login');
        } else if (role === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [token, role, navigate]);

    if (!token || role === 'admin') return null;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8 border-b pb-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-header font-bold uppercase tracking-wider">Panel Empleado</h1>
                        <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">Gestión de Pedidos</p>
                    </div>
                    <button onClick={logout} className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-black transition">
                        Cerrar Sesión
                    </button>
                </div>

                <div className="mb-6 border-b overflow-hidden">
                    <div className="flex gap-4 pb-2 -mb-px">
                        <button
                            className="font-bold uppercase tracking-wider text-xs sm:text-sm pb-2 border-b-2 flex items-center gap-2 transition border-black text-black"
                        >
                            <ShoppingCart size={16} /> Pedidos
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden border">
                    <OrdersTab />
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
