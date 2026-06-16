import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Save, Upload } from 'lucide-react';
import { API_BASE_URL } from '../../api/config';

const ManifestoForm = () => {
    const { getAuthHeaders } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        subtitle: "",
        title_line1: "",
        title_highlight: "",
        title_line2: "",
        principle_1_title: "",
        principle_1_desc: "",
        principle_2_title: "",
        principle_2_desc: "",
        principle_3_title: "",
        principle_3_desc: "",
        quote: "",
        image_1_url: "",
        image_2_url: "",
        bg_text_1: "",
        bg_text_2: ""
    });

    const [files, setFiles] = useState({ img1: null, img2: null });
    const [previews, setPreviews] = useState({ img1: null, img2: null });

    useEffect(() => {
        fetchManifesto();
    }, []);

    const fetchManifesto = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/manifesto`);
            if (res.ok) {
                const data = await res.json();
                setFormData(data);
                setPreviews({
                    img1: data.image_1_url,
                    img2: data.image_2_url
                });
            }
        } catch (err) {
            console.error("Error fetching manifesto:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            setFiles(prev => ({ ...prev, [`img${index}`]: file }));
            setPreviews(prev => ({ ...prev, [`img${index}`]: URL.createObjectURL(file) }));
        }
    };

    const uploadImage = async (fileToUpload) => {
        if (!fileToUpload) return null;
        const imgData = new FormData();
        imgData.append('file', fileToUpload);

        const res = await fetch(`${API_BASE_URL}/admin/upload-image`, {
            method: 'POST',
            body: imgData,
            headers: getAuthHeaders()
        });

        if (res.ok) {
            const data = await res.json();
            return data.url;
        }
        return null;
    };

    const resolveImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') || url.startsWith('blob') ? url : `${API_BASE_URL}${encodeURI(url)}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let finalImg1 = formData.image_1_url;
            let finalImg2 = formData.image_2_url;

            if (files.img1) {
                const uploadedUrl = await uploadImage(files.img1);
                if (uploadedUrl) finalImg1 = uploadedUrl;
            }
            if (files.img2) {
                const uploadedUrl = await uploadImage(files.img2);
                if (uploadedUrl) finalImg2 = uploadedUrl;
            }

            const payload = { ...formData, image_1_url: finalImg1, image_2_url: finalImg2 };

            const res = await fetch(`${API_BASE_URL}/admin/manifesto`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("¡Manifiesto guardado con éxito!");
            } else {
                alert("Error al guardar manifiesto");
            }
        } catch (err) {
            console.error("Error saving manifesto:", err);
            alert("Error al conectar con el servidor");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4 text-gray-500">Cargando datos del manifiesto...</div>;

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg max-w-4xl mx-auto border mb-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-xl font-bold uppercase">Gestión de Manifiesto (Homepage)</h3>
                <button type="submit" disabled={saving} className="bg-black text-white px-4 py-2 font-bold uppercase text-sm flex items-center gap-2 hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sección Textos Principales */}
                <div className="space-y-4">
                    <h4 className="font-bold uppercase border-b pb-2 mb-4 text-gray-600">Textos Principales</h4>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Subtítulo Pequeño</label>
                        <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black" placeholder="Ej. Nuestro Manifiesto" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Título - Línea 1</label>
                        <input type="text" name="title_line1" value={formData.title_line1} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black" placeholder="Ej. Diseñamos para la" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Título - Palabra Central (Highlight gradient)</label>
                        <input type="text" name="title_highlight" value={formData.title_highlight} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black" placeholder="Ej. mujer real" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Título - Línea 2</label>
                        <input type="text" name="title_line2" value={formData.title_line2} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black" placeholder="Ej. la que inspira." />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Frase Final (Quote)</label>
                        <textarea name="quote" value={formData.quote} onChange={handleChange} rows="3" className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black" placeholder="Ej. Gege the Brand nace de la necesidad de..." />
                    </div>

                    <div className="pt-4 border-t">
                        <h4 className="font-bold uppercase border-b pb-2 mb-4 text-gray-600">Textos de Fondo (Marca de Agua)</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Fondo Arriba Izquierda</label>
                                <input type="text" name="bg_text_1" value={formData.bg_text_1} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black" placeholder="Ej. GEGE" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Fondo Abajo Derecha</label>
                                <input type="text" name="bg_text_2" value={formData.bg_text_2} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black" placeholder="Ej. THE BRAND" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección Valores e Imágenes */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h4 className="font-bold uppercase border-b pb-2 text-gray-600">3 Pilares / Valores</h4>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-[10px] font-bold uppercase mb-1">Pilar 1 - Título</label>
                                <input type="text" name="principle_1_title" value={formData.principle_1_title} onChange={handleChange} className="w-full border rounded p-2 text-sm" placeholder="Ej. Elegancia" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase mb-1">Pilar 1 - Desc.</label>
                                <input type="text" name="principle_1_desc" value={formData.principle_1_desc} onChange={handleChange} className="w-full border rounded p-2 text-sm" placeholder="Ej. La belleza en la simplicidad" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-[10px] font-bold uppercase mb-1">Pilar 2 - Título</label>
                                <input type="text" name="principle_2_title" value={formData.principle_2_title} onChange={handleChange} className="w-full border rounded p-2 text-sm" placeholder="Ej. Autenticidad" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase mb-1">Pilar 2 - Desc.</label>
                                <input type="text" name="principle_2_desc" value={formData.principle_2_desc} onChange={handleChange} className="w-full border rounded p-2 text-sm" placeholder="Ej. Viste tu verdad cada día" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-[10px] font-bold uppercase mb-1">Pilar 3 - Título</label>
                                <input type="text" name="principle_3_title" value={formData.principle_3_title} onChange={handleChange} className="w-full border rounded p-2 text-sm" placeholder="Ej. Fuerza" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase mb-1">Pilar 3 - Desc.</label>
                                <input type="text" name="principle_3_desc" value={formData.principle_3_desc} onChange={handleChange} className="w-full border rounded p-2 text-sm" placeholder="Ej. Empoderamiento..." />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold uppercase border-b pb-2 text-gray-600">Imágenes Flotantes</h4>

                        <div className="flex gap-4 items-end">
                            <div className="w-20 h-24 bg-gray-100 border flex items-center justify-center overflow-hidden rounded-md">
                                {previews.img1 ? (
                                    <img src={resolveImageUrl(previews.img1)} alt="preview 1" className="w-full h-full object-cover" />
                                ) : <span className="text-[10px] text-gray-400">Sin img</span>}
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold uppercase mb-1">Imagen Izquierda (Vertical)</label>
                                <input type="file" accept="image/*, .heic, .heif, .webp" onChange={(e) => handleImageChange(e, 1)} className="hidden" id="manif-img-1" />
                                <label htmlFor="manif-img-1" className="cursor-pointer inline-flex items-center gap-2 border px-3 py-1 text-xs font-bold uppercase hover:bg-gray-50 transition w-full justify-center">
                                    <Upload size={14} /> Cambiar Foto
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-4 items-end">
                            <div className="w-20 h-24 bg-gray-100 border flex items-center justify-center overflow-hidden rounded-full">
                                {previews.img2 ? (
                                    <img src={resolveImageUrl(previews.img2)} alt="preview 2" className="w-full h-full object-cover" />
                                ) : <span className="text-[10px] text-gray-400">Sin img</span>}
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold uppercase mb-1">Imagen Derecha (Redonda)</label>
                                <input type="file" accept="image/*, .heic, .heif, .webp" onChange={(e) => handleImageChange(e, 2)} className="hidden" id="manif-img-2" />
                                <label htmlFor="manif-img-2" className="cursor-pointer inline-flex items-center gap-2 border px-3 py-1 text-xs font-bold uppercase hover:bg-gray-50 transition w-full justify-center">
                                    <Upload size={14} /> Cambiar Foto
                                </label>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </form>
    );
};

export default ManifestoForm;
