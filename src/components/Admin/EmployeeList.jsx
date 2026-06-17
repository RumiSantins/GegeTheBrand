import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Trash2, CheckCircle, Clock } from 'lucide-react';
import { API_BASE_URL } from '../../api/config';

const EmployeeList = () => {
    const { getAuthHeaders } = useContext(AuthContext);
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ dni: '', first_name: '', last_name: '' });
    const [error, setError] = useState('');

    const fetchEmployees = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/admin/employees`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setEmployees(data);
            }
        } catch (err) {
            console.error("Error al obtener empleados:", err);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/admin/employees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowForm(false);
                setFormData({ dni: '', first_name: '', last_name: '' });
                fetchEmployees();
            } else {
                const data = await res.json();
                setError(data.detail || 'Error al agregar empleado');
            }
        } catch (err) {
            setError('Error de conexión');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que deseas revocar el acceso a este empleado?")) {
            try {
                const res = await fetch(`${API_BASE_URL}/admin/employees/${id}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                });
                if (res.ok) {
                    fetchEmployees();
                } else {
                    alert("Error eliminando empleado");
                }
            } catch (err) {
                console.error("Error de conexión:", err);
            }
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 border">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold uppercase tracking-wider">Gestión de Empleados</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition"
                >
                    <Plus size={16} /> Agregar DNI
                </button>
            </div>

            {showForm && (
                <div className="mb-8 p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-bold mb-4 uppercase text-sm tracking-wider">Autorizar Nuevo Empleado</h3>
                    <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs uppercase tracking-wider mb-2">DNI</label>
                            <input
                                type="text"
                                required
                                value={formData.dni}
                                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                                className="w-full border-b border-gray-300 p-2 focus:border-black outline-none bg-transparent"
                                placeholder="Ej. 12345678"
                            />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-xs uppercase tracking-wider mb-2">Nombres</label>
                            <input
                                type="text"
                                required
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                className="w-full border-b border-gray-300 p-2 focus:border-black outline-none bg-transparent"
                                placeholder="Ej. Maria Jose"
                            />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-xs uppercase tracking-wider mb-2">Apellidos</label>
                            <input
                                type="text"
                                required
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                className="w-full border-b border-gray-300 p-2 focus:border-black outline-none bg-transparent"
                                placeholder="Ej. Perez"
                            />
                        </div>
                        <button type="submit" className="bg-black text-white px-6 py-2 uppercase text-sm font-bold tracking-widest hover:bg-gray-800 transition">
                            Guardar
                        </button>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b uppercase text-xs tracking-wider text-gray-500">
                            <th className="p-4">DNI</th>
                            <th className="p-4">Nombres</th>
                            <th className="p-4">Apellidos</th>
                            <th className="p-4">Usuario</th>
                            <th className="p-4">Estado</th>
                            <th className="p-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4 font-mono">{emp.dni}</td>
                                <td className="p-4">{emp.first_name || emp.name}</td>
                                <td className="p-4">{emp.last_name || '-'}</td>
                                <td className="p-4">{emp.username || <span className="text-gray-400 italic">No asignado</span>}</td>
                                <td className="p-4">
                                    {emp.is_registered ? (
                                        <span className="flex items-center gap-1 text-green-600 text-sm font-bold">
                                            <CheckCircle size={16} /> Registrado
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-orange-500 text-sm font-bold">
                                            <Clock size={16} /> Pendiente
                                        </span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleDelete(emp.id)}
                                        className="text-red-500 hover:text-red-700 transition"
                                        title="Revocar acceso"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {employees.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500 uppercase tracking-widest text-sm">
                                    No hay empleados registrados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-8 bg-blue-50 text-blue-900 p-4 rounded-lg text-sm flex gap-4">
                <p>
                    <strong>Nota:</strong> Los empleados que agregues aquí podrán ir a <code className="bg-white px-2 py-1 rounded">/employee/register</code> para completar su registro usando su DNI, y luego podrán iniciar sesión en <code className="bg-white px-2 py-1 rounded">/employee/login</code> para gestionar pedidos.
                </p>
            </div>
        </div>
    );
};

export default EmployeeList;
