import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderReceipt = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                const res = await fetch(`http://localhost:8080/admin/orders/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                } else {
                    setError('Error al cargar la orden');
                }
            } catch (err) {
                console.error(err);
                setError('Error de conexión');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    useEffect(() => {
        if (order && !loading) {
            // Trigger print dialog shortly after render
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }, [order, loading]);

    if (loading) return <div className="p-8 text-center text-gray-500 font-body">Cargando comprobante...</div>;
    if (error || !order) return <div className="p-8 text-center text-red-500 font-body font-bold uppercase">{error || 'Orden no encontrada'}</div>;

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('es-PE') + ' ' + date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white min-h-screen font-body text-black p-8 print:p-0 flex flex-col items-center">
            {/* Ticket Container */}
            <div className="w-full max-w-md border border-gray-200 p-8 print:border-none print:w-full print:max-w-none print:p-4">

                {/* Header */}
                <div className="text-center mb-8 border-b-2 border-black pb-6 border-dashed">
                    <h1 className="text-3xl font-header font-bold uppercase tracking-widest mb-2">GEGE THE BRAND</h1>
                    <p className="text-sm uppercase tracking-widest text-gray-500">Comprobante de Venta</p>
                    <p className="text-xs text-gray-400 mt-2">Lima, Perú</p>
                </div>

                {/* Info */}
                <div className="mb-6 space-y-2 text-sm uppercase">
                    <div className="flex justify-between">
                        <span className="font-bold">Nro. Orden:</span>
                        <span>{order.order_number}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-bold">Fecha:</span>
                        <span>{formatDate(order.created_at)}</span>
                    </div>
                    {order.customer_info && (
                        <div className="pt-2">
                            <span className="font-bold block mb-1">Cliente / Notas:</span>
                            <p className="text-gray-600 bg-gray-50 p-2 rounded">{order.customer_info}</p>
                        </div>
                    )}
                </div>

                {/* Items */}
                <div className="mb-8 border-t-2 border-b-2 border-black py-4 border-dashed">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="uppercase tracking-wider border-b border-gray-300">
                                <th className="text-left pb-2 font-bold w-1/2">Cant. / Prod.</th>
                                <th className="text-right pb-2 font-bold">Importe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-100 last:border-0">
                                    <td className="py-3 text-left">
                                        <div className="font-bold uppercase">{item.quantity}x {item.product_name}</div>
                                        <div className="text-xs text-gray-500 uppercase mt-1">{item.size || 'Única'}</div>
                                    </td>
                                    <td className="py-3 text-right font-bold tabular-nums">
                                        S/ {(item.price_at_time * item.quantity).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals and Payment */}
                <div className="space-y-2 mb-8 uppercase text-sm">
                    <div className="flex justify-between items-center text-xl font-bold tracking-widest pt-2">
                        <span>Total</span>
                        <span>S/ {order.total_amount.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 space-y-1">
                        <div className="flex justify-between">
                            <span className="font-bold">Método de Pago:</span>
                            <span>{order.payment_method || 'Efectivo'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">Monto Recibido:</span>
                            <span>S/ {(order.amount_paid || 0).toFixed(2)}</span>
                        </div>
                        {(order.payment_method === 'Efectivo' || !order.payment_method) && (
                            <div className="flex justify-between text-base font-bold bg-gray-50 p-2 mt-2">
                                <span>Vuelto:</span>
                                <span>S/ {Math.max(0, (order.amount_paid || 0) - order.total_amount).toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs uppercase text-gray-500 tracking-widest border-t border-gray-200 mt-8 pt-6">
                    <p className="mb-2">¡Gracias por tu compra!</p>
                    <p>Encuentra más en gegethebrand.com</p>
                    <p className="mt-4 text-[10px]">Copia generada: {formatDate(new Date())}</p>
                </div>
            </div>

            {/* Print Action Buttons (hidden in print mode) */}
            <div className="mt-8 flex gap-4 print:hidden">
                <button
                    onClick={() => window.print()}
                    className="px-6 py-3 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 transition"
                >
                    Imprimir Comprobante
                </button>
                <button
                    onClick={() => window.close()}
                    className="px-6 py-3 border border-gray-300 font-bold uppercase tracking-widest hover:bg-gray-50 transition"
                >
                    Cerrar Pestaña
                </button>
            </div>
        </div>
    );
};

export default OrderReceipt;
