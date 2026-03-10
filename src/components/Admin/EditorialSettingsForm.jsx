import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Save, Upload } from 'lucide-react';

const EditorialSettingsForm = () => {
    const { getAuthHeaders, token } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        bg_text: "",
        title_line1: "",
        title_italic: "",
        title_gradient: "",
        description: "",
        quote_text: "",
        quote_author: "",
        look_name: "",
        look_price: "",
        image_1_url: "",
        image_2_url: "",
        image_main_url: "",
        image_3_url: "",
        image_4_url: "",
        image_5_url: ""
    });

    const [files, setFiles] = useState({
        img1: null, img2: null, imgMain: null, img3: null, img4: null, img5: null
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('http://localhost:8080/editorial-settings');
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    bg_text: data.bg_text || "",
                    title_line1: data.title_line1 || "",
                    title_italic: data.title_italic || "",
                    title_gradient: data.title_gradient || "",
                    description: data.description || "",
                    quote_text: data.quote_text || "",
                    quote_author: data.quote_author || "",
                    look_name: data.look_name || "",
                    look_price: data.look_price || "",
                    image_1_url: data.image_1_url || "",
                    image_2_url: data.image_2_url || "",
                    image_main_url: data.image_main_url || "",
                    image_3_url: data.image_3_url || "",
                    image_4_url: data.image_4_url || "",
                    image_5_url: data.image_5_url || ""
                });
            }
        } catch (err) {
            console.error("Error fetching editorial settings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, key) => {
        setFiles(prev => ({ ...prev, [key]: e.target.files[0] }));

        // Preview local
        if (e.target.files[0]) {
            const tempUrl = URL.createObjectURL(e.target.files[0]);
            const formDataKey = key === 'imgMain' ? 'image_main_url' : `image_${key.replace('img', '')}_url`;
            setFormData(prev => ({ ...prev, [formDataKey]: tempUrl }));
        }
    };

    const resolveImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') || url.startsWith('blob') ? url : `http://localhost:8080${encodeURI(url)}`;
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('http://localhost:8080/admin/upload-image', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        return data.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setUploading(true);

        try {
            let updatedData = { ...formData };

            const uploadPromises = [];
            const fileKeys = [
                { f: files.img1, key: 'image_1_url' },
                { f: files.img2, key: 'image_2_url' },
                { f: files.imgMain, key: 'image_main_url' },
                { f: files.img3, key: 'image_3_url' },
                { f: files.img4, key: 'image_4_url' },
                { f: files.img5, key: 'image_5_url' }
            ];

            for (let item of fileKeys) {
                if (item.f) {
                    uploadPromises.push(
                        uploadImage(item.f).then(url => {
                            updatedData[item.key] = url;
                        })
                    );
                }
            }

            if (uploadPromises.length > 0) {
                await Promise.all(uploadPromises);
            }

            const res = await fetch('http://localhost:8080/admin/editorial-settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(updatedData)
            });

            if (res.ok) {
                alert("¡Ajustes de Editorial guardados con éxito!");
            } else {
                alert("Error al guardar los ajustes");
            }
        } catch (err) {
            console.error("Error saving editorial settings:", err);
            alert("Error al conectar con el servidor");
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    if (loading) return <div className="p-4 text-gray-500">Cargando ajustes editoriales...</div>;

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg max-w-4xl mx-auto border mb-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-xl font-bold uppercase">Gestión de Editorial (Homepage)</h3>
                <button type="submit" disabled={saving} className="bg-black text-white px-4 py-2 font-bold uppercase text-sm flex items-center gap-2 hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Textos Principales y Moodboard 1 */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h4 className="font-bold uppercase border-b pb-2 text-gray-600">Título y Descripción</h4>

                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Título - Línea 1</label>
                            <input type="text" name="title_line1" value={formData.title_line1} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black" placeholder="Ej. LA" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Título - Palabra Itálica</label>
                            <input type="text" name="title_italic" value={formData.title_italic} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black" placeholder="Ej. NUEVA" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Título - Gradient Text</label>
                            <input type="text" name="title_gradient" value={formData.title_gradient} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black" placeholder="Ej. POÉTICA" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Descripción Corta</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black" placeholder="Ej. Redefiniendo la feminidad..." />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold uppercase border-b pb-2 text-gray-600">Imágenes (Moodboard Izquierda)</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="block text-xs font-bold uppercase mb-1">Imagen 1</label>
                                <div className="flex gap-4 items-end">
                                    <div className="w-16 h-20 bg-gray-100 border flex items-center justify-center overflow-hidden rounded-md flex-shrink-0">
                                        {formData.image_1_url ? (
                                            <img src={resolveImageUrl(formData.image_1_url)} alt="Img 1" className="w-full h-full object-cover" />
                                        ) : <span className="text-[10px] text-gray-400">Var</span>}
                                    </div>
                                    <div className="flex-1 w-full">
                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'img1')} className="hidden" id="edit-img-1" />
                                        <label htmlFor="edit-img-1" className="cursor-pointer inline-flex items-center gap-2 border px-2 py-1 text-[10px] font-bold uppercase hover:bg-gray-50 transition w-full justify-center whitespace-nowrap">
                                            <Upload size={12} /> Cambiar Foto
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="block text-xs font-bold uppercase mb-1">Imagen 2</label>
                                <div className="flex gap-4 items-end">
                                    <div className="w-16 h-20 bg-gray-100 border flex items-center justify-center overflow-hidden rounded-md flex-shrink-0">
                                        {formData.image_2_url ? (
                                            <img src={resolveImageUrl(formData.image_2_url)} alt="Img 2" className="w-full h-full object-cover" />
                                        ) : <span className="text-[10px] text-gray-400">Var</span>}
                                    </div>
                                    <div className="flex-1 w-full">
                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'img2')} className="hidden" id="edit-img-2" />
                                        <label htmlFor="edit-img-2" className="cursor-pointer inline-flex items-center gap-2 border px-2 py-1 text-[10px] font-bold uppercase hover:bg-gray-50 transition w-full justify-center whitespace-nowrap">
                                            <Upload size={12} /> Cambiar Foto
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold uppercase border-b pb-2 text-gray-600">Imágenes (Lado Derecho)</h4>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="block text-xs font-bold uppercase mb-1">Imagen 3 (Vertical Izquierda)</label>
                                <div className="flex gap-4 items-end">
                                    <div className="w-20 h-24 bg-gray-100 border flex items-center justify-center overflow-hidden rounded-md flex-shrink-0">
                                        {formData.image_3_url ? (
                                            <img src={resolveImageUrl(formData.image_3_url)} alt="Img 3" className="w-full h-full object-cover" />
                                        ) : <span className="text-[10px] text-gray-400">Var</span>}
                                    </div>
                                    <div className="flex-1 w-full">
                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'img3')} className="hidden" id="edit-img-3" />
                                        <label htmlFor="edit-img-3" className="cursor-pointer inline-flex items-center gap-2 border px-3 py-1 text-xs font-bold uppercase hover:bg-gray-50 transition justify-center">
                                            <Upload size={14} /> Cambiar Foto
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="flex flex-col gap-2">
                                    <label className="block text-xs font-bold uppercase mb-1">Imagen 4</label>
                                    <div className="flex gap-4 items-end border-t pt-2 border-gray-100">
                                        <div className="w-16 h-20 bg-gray-100 border flex items-center justify-center overflow-hidden rounded-md flex-shrink-0">
                                            {formData.image_4_url ? (
                                                <img src={resolveImageUrl(formData.image_4_url)} alt="Img 4" className="w-full h-full object-cover" />
                                            ) : <span className="text-[10px] text-gray-400">Var</span>}
                                        </div>
                                        <div className="flex-1 w-full">
                                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'img4')} className="hidden" id="edit-img-4" />
                                            <label htmlFor="edit-img-4" className="cursor-pointer inline-flex items-center gap-2 border px-2 py-1 text-[10px] font-bold uppercase hover:bg-gray-50 transition w-full justify-center whitespace-nowrap">
                                                <Upload size={12} /> Cambiar Foto
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="block text-xs font-bold uppercase mb-1">Imagen 5</label>
                                    <div className="flex gap-4 items-end border-t pt-2 border-gray-100">
                                        <div className="w-16 h-20 bg-gray-100 border flex items-center justify-center overflow-hidden rounded-md flex-shrink-0">
                                            {formData.image_5_url ? (
                                                <img src={resolveImageUrl(formData.image_5_url)} alt="Img 5" className="w-full h-full object-cover" />
                                            ) : <span className="text-[10px] text-gray-400">Var</span>}
                                        </div>
                                        <div className="flex-1 w-full">
                                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'img5')} className="hidden" id="edit-img-5" />
                                            <label htmlFor="edit-img-5" className="cursor-pointer inline-flex items-center gap-2 border px-2 py-1 text-[10px] font-bold uppercase hover:bg-gray-50 transition w-full justify-center whitespace-nowrap">
                                                <Upload size={12} /> Cambiar Foto
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Cita */}
                    <div className="space-y-4">
                        <h4 className="font-bold uppercase border-b pb-2 text-gray-600">Cita Destacada</h4>

                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Texto de la Cita</label>
                            <input type="text" name="quote_text" value={formData.quote_text} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black" placeholder="Ej. La elegancia es la única belleza..." />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Autor de la Cita</label>
                            <input type="text" name="quote_author" value={formData.quote_author} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black" placeholder="Ej. Audrey Hepburn" />
                        </div>
                    </div>

                    {/* Ficha Imagen Central */}
                    <div className="space-y-4">
                        <h4 className="font-bold uppercase border-b pb-2 text-gray-600">Imagen Central y Detalles (Look Reference)</h4>

                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Imagen Principal Grande</label>
                            <div className="flex gap-4 flex-col">
                                <div className="w-full h-48 bg-gray-100 border flex items-center justify-center overflow-hidden rounded-md">
                                    {formData.image_main_url ? (
                                        <img src={resolveImageUrl(formData.image_main_url)} alt="Main" className="w-full h-full object-cover" />
                                    ) : <span className="text-[10px] text-gray-400">Sin foto</span>}
                                </div>
                                <div className="flex-1 w-full max-w-sm">
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'imgMain')} className="hidden" id="edit-img-main" />
                                    <label htmlFor="edit-img-main" className="cursor-pointer inline-flex items-center gap-2 border px-3 py-2 text-xs font-bold uppercase hover:bg-gray-50 transition w-full justify-center">
                                        <Upload size={14} /> Cambiar Foto Principal
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Nombre del Look</label>
                                <input type="text" name="look_name" value={formData.look_name} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black" placeholder="Ej. Conjunto Minimal Seda" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Precio / Etiqueta</label>
                                <input type="text" name="look_price" value={formData.look_price} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black" placeholder="Ej. S/ 185" />
                            </div>
                        </div>
                    </div>

                    {/* Texto Fondo */}
                    <div className="space-y-4">
                        <h4 className="font-bold uppercase border-b pb-2 text-gray-600">Texto de Fondo (Marca de Agua)</h4>

                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Texto (Arriba Derecha)</label>
                            <input type="text" name="bg_text" value={formData.bg_text} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black" placeholder="Ej. Muse" />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default EditorialSettingsForm;
