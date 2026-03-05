import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
    const { token, logout, getAuthHeaders } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:8080/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (err) {
            console.error("Error al obtener productos:", err);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
        } else {
            fetchProducts();
        }
    }, [token, navigate]);

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
            try {
                const res = await fetch(`http://localhost:8080/admin/products/${id}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                });
                if (res.ok) {
                    fetchProducts();
                } else {
                    alert("Error eliminando el producto");
                }
            } catch (err) {
                console.error("Error de conexión:", err);
            }
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleAddNewClick = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const resolveImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `http://localhost:8080${url}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-header font-bold uppercase tracking-wider">Panel de Administración</h1>
                    <button onClick={logout} className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-black transition">
                        Cerrar Sesión
                    </button>
                </div>

                {showForm ? (
                    <div className="mb-8">
                        <ProductForm
                            initialData={editingProduct}
                            onSaved={() => {
                                setShowForm(false);
                                fetchProducts();
                            }}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                ) : (
                    <div className="bg-white shadow rounded-lg overflow-hidden border">
                        <div className="p-4 border-b flex justify-between bg-gray-100 items-center">
                            <h2 className="font-header font-bold uppercase">Inventario de Productos</h2>
                            <button onClick={handleAddNewClick} className="bg-black text-white px-4 py-2 text-sm font-bold uppercase flex items-center gap-2 hover:bg-gray-800 transition">
                                <Plus size={16} /> Nuevo
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Imagen</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Nombre</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Categoría / Tallas</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Precio</th>
                                        <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Stock</th>
                                        <th className="px-6 py-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {products.map(product => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {product.image_url && <img src={resolveImageUrl(product.image_url)} alt="Main" className="w-12 h-12 object-cover border" title="Principal" />}
                                                    {product.image2_url && <img src={resolveImageUrl(product.image2_url)} alt="Secondary" className="w-12 h-12 object-cover border opacity-50" title="Secundaria (Hover)" />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium">{product.name}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold">{product.category}</div>
                                                <div className="text-xs text-gray-500">{product.sizes || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                                            <td className="px-6 py-4">{product.stock}</td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <button onClick={() => handleEditClick(product)} className="text-gray-500 hover:text-black transition">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-600 transition">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No hay productos en inventario.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
