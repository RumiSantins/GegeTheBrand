import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { CheckCircle, XCircle, RotateCcw, Clock, Edit2, X, Save, Trash2, Plus, Printer } from 'lucide-react';

const OrdersTab = () => {
    const { getAuthHeaders } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingOrder, setEditingOrder] = useState(null);
    const [editFormData, setEditFormData] = useState({
        customer_info: '',
        items: [],
        amount_paid: 0,
        payment_method: 'Efectivo'
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');

    const filteredOrders = orders.filter(order => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
            order.order_number.toLowerCase().includes(query) ||
            order.items.some(item => item.product_name.toLowerCase().includes(query));
        
        const matchesStatus = statusFilter === 'Todos' || order.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const fetchOrders = async () => {
        try {
            const res = await fetch('http://localhost:8080/admin/orders', {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:8080/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        if (!window.confirm(`¿Seguro que deseas cambiar el estado a ${newStatus}? Se actualizará el inventario correspondiente.`)) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                alert(`Estado cambiado a ${newStatus} exitosamente.`);
                fetchOrders();
            } else {
                alert("Error al actualizar el estado");
            }
        } catch (err) {
            console.error("Error updating order status:", err);
            alert("Error de conexión");
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completada': return <CheckCircle size={16} className="text-green-500" />;
            case 'Cancelada': return <XCircle size={16} className="text-red-500" />;
            case 'Devuelta': return <RotateCcw size={16} className="text-orange-500" />;
            default: return <Clock size={16} className="text-blue-500" />;
        }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('es-PE') + ' ' + date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    };

    const handleEditClick = (order) => {
        setEditingOrder(order);
        setEditFormData({
            customer_info: order.customer_info,
            items: order.items.map(item => ({ ...item })),
            amount_paid: order.amount_paid || 0,
            payment_method: order.payment_method || 'Efectivo'
        });
    };

    const handleCancelEdit = () => {
        setEditingOrder(null);
        setEditFormData({ customer_info: '', items: [], amount_paid: 0, payment_method: 'Efectivo' });
    };

    const handleItemQuantityChange = (index, newQuantity) => {
        const newItems = [...editFormData.items];
        newItems[index].quantity = Math.max(1, parseInt(newQuantity) || 1);
        setEditFormData({ ...editFormData, items: newItems });
    };

    const handleRemoveItem = (index) => {
        const newItems = [...editFormData.items];
        newItems.splice(index, 1);
        setEditFormData({ ...editFormData, items: newItems });
    };

    const handleProductChange = (index, productId) => {
        const newItems = [...editFormData.items];
        const selectedProduct = products.find(p => p.id === productId);

        if (selectedProduct) {
            newItems[index] = {
                ...newItems[index],
                product_id: selectedProduct.id,
                product_name: selectedProduct.name,
                price_at_time: selectedProduct.price,
                // Reset variant when product changes
                variant_id: null,
                size: ''
            };
            setEditFormData({ ...editFormData, items: newItems });
        }
    };

    const handleVariantChange = (index, variantId) => {
        const newItems = [...editFormData.items];
        const currentItem = newItems[index];
        const selectedProduct = products.find(p => p.id === currentItem.product_id);

        if (selectedProduct) {
            const selectedVariant = selectedProduct.variants.find(v => v.id === variantId);
            if (selectedVariant) {
                newItems[index].variant_id = selectedVariant.id;
                newItems[index].size = selectedVariant.size + (selectedVariant.color ? ` - ${selectedVariant.color}` : '');
                setEditFormData({ ...editFormData, items: newItems });
            }
        }
    };

    const handleAddProduct = () => {
        setEditFormData({
            ...editFormData,
            items: [
                ...editFormData.items,
                {
                    product_id: '',
                    product_name: 'Seleccionar un Producto',
                    variant_id: null,
                    size: '',
                    quantity: 1,
                    price_at_time: 0
                }
            ]
        });
    };

    const handleSaveEdit = async () => {
        if (editFormData.items.length === 0) {
            alert("No puedes dejar el pedido sin productos. Si quieres cancelarlo, cambia su estado a Cancelada.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/admin/orders/${editingOrder.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(editFormData)
            });

            if (res.ok) {
                alert("Pedido actualizado exitosamente.");
                setEditingOrder(null);
                fetchOrders();
            } else {
                alert("Error al guardar la edición");
            }
        } catch (err) {
            console.error("Error updating order:", err);
            alert("Error de conexión");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando pedidos...</div>;

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden border">
            <div className="p-4 border-b bg-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="font-header font-bold uppercase min-w-max">Gestión de Pedidos</h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <input 
                        type="text" 
                        placeholder="Buscar por orden o producto..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black w-full sm:w-64"
                    />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    >
                        <option value="Todos">Todos los estados</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Completada">Completada</option>
                        <option value="Cancelada">Cancelada</option>
                        <option value="Devuelta">Devuelta</option>
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto p-4">
                <div className="space-y-6">
                    {filteredOrders.length === 0 && (
                        <p className="text-center text-gray-500 italic py-8">No se encontraron pedidos que coincidan con la búsqueda.</p>
                    )}
                    {filteredOrders.map(order => (
                        <div key={order.id} className="border rounded-lg p-4 bg-gray-50 shadow-sm relative group">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                {order.status === 'Completada' && (
                                    <button onClick={() => window.open(`/admin/receipt/${order.id}`, '_blank')} className="text-gray-400 hover:text-black bg-white p-2 rounded shadow-sm border" title="Imprimir Comprobante">
                                        <Printer size={16} />
                                    </button>
                                )}
                                <button onClick={() => handleEditClick(order)} className="text-gray-400 hover:text-black bg-white p-2 rounded shadow-sm border" title="Editar Pedido">
                                    <Edit2 size={16} />
                                </button>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b gap-4">
                                <div>
                                    <h3 className="font-bold text-lg">{order.order_number}</h3>
                                    <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                                    <p className="text-sm mt-1 text-gray-700">{order.customer_info}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total</p>
                                        <p className="font-bold text-xl">S/ {order.total_amount.toFixed(2)}</p>
                                    </div>
                                    <div className="text-right border-l pl-4">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Pago</p>
                                        <p className="font-bold text-sm">{order.payment_method}</p>
                                        <p className="text-xs text-gray-500">Recibido: S/ {order.amount_paid ? order.amount_paid.toFixed(2) : '0.00'}</p>
                                    </div>
                                    <div className="border-l pl-4">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Estado</p>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(order.status)}
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`text-sm border-b-2 bg-transparent focus:outline-none font-bold ${order.status === 'Completada' ? 'border-green-500 text-green-700' :
                                                    order.status === 'Cancelada' ? 'border-red-500 text-red-700' :
                                                        order.status === 'Devuelta' ? 'border-orange-500 text-orange-700' :
                                                            'border-blue-500 text-blue-700'
                                                    }`}
                                            >
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="Completada">Completada</option>
                                                <option value="Cancelada">Cancelada</option>
                                                <option value="Devuelta">Devuelta</option>
                                                <option value="Eliminada">Eliminada</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-gray-500">Productos del Pedido</h4>
                                <div className="space-y-2">
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded border text-sm">
                                            <div className="flex flex-col">
                                                <span className="font-bold">{item.product_name}</span>
                                                <span className="text-xs text-gray-500">Talla: {item.size} | Precio: S/ {item.price_at_time.toFixed(2)}</span>
                                            </div>
                                            <div className="font-bold bg-gray-100 px-3 py-1 rounded">
                                                x{item.quantity}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de Edición */}
            {editingOrder && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                            <h3 className="font-bold text-lg">Editar Pedido {editingOrder.order_number}</h3>
                            <button onClick={handleCancelEdit} className="text-gray-500 hover:text-black">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-6">
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Información del Cliente / Notas</label>
                                    <textarea
                                        value={editFormData.customer_info}
                                        onChange={(e) => setEditFormData({ ...editFormData, customer_info: e.target.value })}
                                        rows="3"
                                        className="w-full border rounded p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Método de Pago</label>
                                        <select
                                            value={editFormData.payment_method}
                                            onChange={(e) => setEditFormData({ ...editFormData, payment_method: e.target.value })}
                                            className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                        >
                                            <option value="Efectivo">Efectivo 💵</option>
                                            <option value="Transferencia">Transferencia 🏦</option>
                                            <option value="Yape">Yape 📱</option>
                                            <option value="Plin">Plin 📱</option>
                                            <option value="Tarjeta">Tarjeta 💳</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Monto Pagado por el Cliente (S/)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editFormData.amount_paid}
                                            onChange={(e) => setEditFormData({ ...editFormData, amount_paid: parseFloat(e.target.value) || 0 })}
                                            className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                        />
                                        {editFormData.payment_method === 'Efectivo' && (
                                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded flex justify-between items-center">
                                                <span className="text-xs font-bold uppercase text-yellow-700">Vuelto para el Cliente:</span>
                                                <span className="font-bold text-yellow-900">
                                                    S/ {Math.max(0, editFormData.amount_paid - editFormData.items.reduce((total, item) => total + (item.price_at_time * item.quantity), 0)).toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase mb-2 text-gray-500">Productos ({editFormData.items.length})</label>
                                <div className="border rounded divide-y">
                                    {editFormData.items.map((item, index) => {
                                        const parentProduct = products.find(p => p.id === item.product_id);
                                        const availableVariants = parentProduct ? parentProduct.variants : [];

                                        return (
                                            <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 bg-white sm:items-center">
                                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Producto</label>
                                                        <select
                                                            value={item.product_id || ''}
                                                            onChange={(e) => handleProductChange(index, e.target.value)}
                                                            className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                                        >
                                                            <option value="" disabled>Seleccionar Producto...</option>
                                                            {products.map(p => (
                                                                <option key={p.id} value={p.id}>{p.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Talla/Color</label>
                                                        {availableVariants.length > 0 ? (
                                                            <select
                                                                value={item.variant_id || ''}
                                                                onChange={(e) => handleVariantChange(index, e.target.value)}
                                                                disabled={!item.product_id}
                                                                className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-100 disabled:text-gray-400"
                                                            >
                                                                <option value="" disabled>Seleccionar Variante...</option>
                                                                {availableVariants.map(v => (
                                                                    <option key={v.id} value={v.id}>
                                                                        {v.size} {v.color ? `- ${v.color}` : ''} (Stock: {v.stock})
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <select
                                                                disabled
                                                                className="w-full border rounded p-2 text-sm bg-gray-100 text-gray-400"
                                                            >
                                                                <option>Única / Sin variantes</option>
                                                            </select>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 justify-between sm:justify-end">
                                                    <div className="text-right">
                                                        <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Precio Unit.</label>
                                                        <p className="text-sm font-bold">S/ {item.price_at_time.toFixed(2)}</p>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Cant.</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => handleItemQuantityChange(index, e.target.value)}
                                                            className="w-16 border rounded p-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-black"
                                                        />
                                                    </div>
                                                    <div className="pt-4">
                                                        <button onClick={() => handleRemoveItem(index)} className="text-red-400 hover:text-red-600 p-2" title="Eliminar del pedido">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {editFormData.items.length === 0 && (
                                        <div className="p-4 text-center text-red-500 text-sm font-bold">
                                            El pedido no tiene productos.
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3 flex justify-between items-center">
                                    <button
                                        onClick={handleAddProduct}
                                        className="text-xs font-bold uppercase flex items-center gap-1 text-gray-600 hover:text-black transition"
                                    >
                                        <Plus size={14} /> Añadir Producto al Pedido
                                    </button>
                                    <div className="text-right">
                                        <span className="text-xs uppercase font-bold text-gray-500 mr-2">Nuevo Total:</span>
                                        <span className="font-bold text-lg">
                                            S/ {editFormData.items.reduce((total, item) => total + (item.price_at_time * item.quantity), 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-4 italic uppercase">Al guardar, si el pedido estaba "Completada", el inventario devolverá el stock antiguo y descontará el nuevo de forma automática.</p>
                            </div>
                        </div>

                        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-lg">
                            <button onClick={handleCancelEdit} className="px-4 py-2 border font-bold uppercase text-xs hover:bg-gray-100 transition">
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={editFormData.items.some(item => {
                                    const p = products.find(prod => prod.id === item.product_id);
                                    const hasVariants = p && p.variants && p.variants.length > 0;
                                    return !item.product_id || (hasVariants && !item.variant_id);
                                })}
                                className="px-4 py-2 bg-black text-white font-bold uppercase text-xs hover:bg-gray-800 transition flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                <Save size={14} /> Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersTab;
