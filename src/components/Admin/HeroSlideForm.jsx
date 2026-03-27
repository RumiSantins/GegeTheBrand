import React, { useState, useContext } from 'react';
import { X, Upload } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '../../api/config';

const HeroSlideForm = ({ initialData, onSaved, onCancel }) => {
    const { getAuthHeaders } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: initialData ? initialData.title : '',
        subtitle: initialData ? initialData.subtitle : '',
        cta_text: initialData ? initialData.cta_text : '',
        cta_url: initialData ? (initialData.cta_url || '') : '',
        image_url: initialData ? initialData.image_url : ''
    });
    const [preview, setPreview] = useState(initialData ? initialData.image_url : null);
    const [file, setFile] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setPreview(URL.createObjectURL(file));
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!initialData && !file && !formData.image_url) {
            alert('Por favor, selecciona una imagen para el nuevo slide.');
            return;
        }

        let finalImageUrl = formData.image_url;
        if (file) {
            const uploadedUrl = await uploadImage(file);
            if (uploadedUrl) {
                finalImageUrl = uploadedUrl;
            } else {
                alert('No se pudo subir la imagen.');
                return;
            }
        }

        const payload = {
            title: formData.title,
            subtitle: formData.subtitle,
            cta_text: formData.cta_text,
            cta_url: formData.cta_url,
            image_url: finalImageUrl
        };

        const method = initialData ? 'PUT' : 'POST';
        const url = initialData
            ? `${API_BASE_URL}/admin/hero-slides/${initialData.id}`
            : `${API_BASE_URL}/admin/hero-slides`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSaved();
            } else {
                alert('Error al guardar el slide');
            }
        } catch (err) {
            console.error(err);
            alert('Error al conectar con el servidor');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg max-w-2xl mx-auto border">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h3 className="text-xl font-bold uppercase">{initialData ? 'Editar Slide Principal' : 'Crear Nuevo Slide'}</h3>
                <button type="button" onClick={onCancel} className="text-gray-500 hover:text-black">
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase mb-1">Título *</label>
                    <input
                        required
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black"
                        placeholder="Ej. NUEVA COLECCIÓN 2026"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase mb-1">Subtítulo *</label>
                    <input
                        required
                        type="text"
                        value={formData.subtitle}
                        onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black"
                        placeholder="Ej. Elegancia minimalista..."
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase mb-1">Texto del Botón (CTA) *</label>
                    <input
                        required
                        type="text"
                        value={formData.cta_text}
                        onChange={e => setFormData({ ...formData, cta_text: e.target.value })}
                        className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black"
                        placeholder="Ej. VER COLECCIÓN"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase mb-1">URL / Enlace del Botón *</label>
                    <input
                        required
                        type="text"
                        value={formData.cta_url}
                        onChange={e => setFormData({ ...formData, cta_url: e.target.value })}
                        className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-black"
                        placeholder="Ej. /categoria/denim o https://gegethebrand.com/shop"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase mb-2">Imagen de Fondo *</label>
                    <div className="flex items-center gap-4">
                        <div className="w-32 h-20 bg-gray-100 border flex items-center justify-center overflow-hidden">
                            {preview ? (
                                <img src={preview.startsWith('http') || preview.startsWith('blob') ? preview : `${API_BASE_URL}${encodeURI(preview)}`} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-400 text-xs text-center px-2">Sin imagen</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="slide-image"
                            />
                            <label htmlFor="slide-image" className="cursor-pointer inline-flex items-center gap-2 border px-4 py-2 text-sm font-bold uppercase hover:bg-gray-50 transition">
                                <Upload size={16} /> Cambiar Imagen
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 border font-bold uppercase text-sm hover:bg-gray-50 transition">
                    Cancelar
                </button>
                <button type="submit" className="bg-black text-white px-6 py-2 font-bold uppercase text-sm hover:bg-gray-800 transition">
                    Guardar Slide
                </button>
            </div>
        </form>
    );
};

export default HeroSlideForm;
