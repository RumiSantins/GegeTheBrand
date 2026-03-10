import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Save } from 'lucide-react';

const SiteSettingsForm = () => {
    const { getAuthHeaders } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        shop_title: "",
        shop_description: "",
        announcement_text: ""
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('http://localhost:8080/site-settings');
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    shop_title: data.shop_title || "",
                    shop_description: data.shop_description || "",
                    announcement_text: data.announcement_text || ""
                });
            }
        } catch (err) {
            console.error("Error fetching site settings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('http://localhost:8080/admin/site-settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert("¡Ajustes guardados con éxito!");
            } else {
                alert("Error al guardar los ajustes");
            }
        } catch (err) {
            console.error("Error saving site settings:", err);
            alert("Error al conectar con el servidor");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4 text-gray-500">Cargando ajustes...</div>;

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg max-w-2xl border mb-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-xl font-bold uppercase">Textos de la Tienda</h3>
                <button type="submit" disabled={saving} className="bg-black text-white px-4 py-2 font-bold uppercase text-sm flex items-center gap-2 hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase mb-1">Título de la Tienda</label>
                    <input
                        type="text"
                        name="shop_title"
                        value={formData.shop_title}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black"
                        placeholder="Ej. TIENDA"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase mb-1">Descripción de la Tienda</label>
                    <textarea
                        name="shop_description"
                        value={formData.shop_description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black"
                        placeholder="Ej. Descubre nuestra última colección..."
                    />
                </div>

                <div className="pt-4 border-t">
                    <label className="block text-xs font-bold uppercase mb-1 text-purple-700">Texto de Anuncio Superior (Marquesina)</label>
                    <textarea
                        name="announcement_text"
                        value={formData.announcement_text}
                        onChange={handleChange}
                        rows="2"
                        className="w-full border border-purple-200 bg-purple-50 rounded p-2 text-sm font-medium focus:outline-none focus:border-purple-500"
                        placeholder="Ej. ENVÍO GRATIS EN COMPRAS MAYORES A $150..."
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Este texto se moverá continuamente en la barra superior de la tienda.</p>
                </div>
            </div>
        </form>
    );
};

export default SiteSettingsForm;
