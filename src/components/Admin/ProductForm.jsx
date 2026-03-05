import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Upload, X, Save } from 'lucide-react';

const ProductForm = ({ onSaved, onCancel, initialData = null }) => {
    const { getAuthHeaders } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '0',
        description: '',
        category: 'General',
        sizes: '',
        colors: ''
    });

    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState('');
    const [secondImage, setSecondImage] = useState(null);
    const [secondImagePreview, setSecondImagePreview] = useState('');

    const categories = ['General', 'Tops', 'Pantalones', 'Abrigos', 'Calzado', 'Vestidos'];

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                price: initialData.price || '',
                stock: initialData.stock || '0',
                description: initialData.description || '',
                category: initialData.category || 'General',
                sizes: initialData.sizes || '',
                colors: initialData.colors || ''
            });

            if (initialData.image_url) {
                const url = initialData.image_url.startsWith('http') ? initialData.image_url : `http://localhost:8080${initialData.image_url}`;
                setMainImagePreview(url);
            }
            if (initialData.image2_url) {
                const url2 = initialData.image2_url.startsWith('http') ? initialData.image2_url : `http://localhost:8080${initialData.image2_url}`;
                setSecondImagePreview(url2);
            }
        }
    }, [initialData]);

    const handleImageChange = (e, setFile, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file) => {
        if (!file) return null;
        const imgData = new FormData();
        imgData.append('file', file);

        const res = await fetch('http://localhost:8080/admin/upload-image', {
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

        let finalImageUrl = initialData?.image_url || '';
        let finalImage2Url = initialData?.image2_url || '';

        if (mainImage) {
            const uploadedUrl = await uploadImage(mainImage);
            if (uploadedUrl) finalImageUrl = uploadedUrl;
        }
        if (secondImage) {
            const uploadedUrl2 = await uploadImage(secondImage);
            if (uploadedUrl2) finalImage2Url = uploadedUrl2;
        }

        const payload = {
            name: formData.name,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            description: formData.description,
            category: formData.category,
            sizes: formData.sizes,
            colors: formData.colors,
            image_url: finalImageUrl,
            image2_url: finalImage2Url
        };

        const method = initialData ? 'PUT' : 'POST';
        const url = initialData
            ? `http://localhost:8080/admin/products/${initialData.id}`
            : 'http://localhost:8080/admin/products';

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
                alert('Error al guardar el producto');
            }
        } catch (err) {
            console.error(err);
            alert('Error al conectar con el servidor');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg max-w-4xl mx-auto border grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold uppercase">{initialData ? 'Editar Producto' : 'Crear Nuevo Producto'}</h3>
                <button type="button" onClick={onCancel} className="text-gray-500 hover:text-black">
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase mb-1">Nombre del producto *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border p-2 text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Precio ($) *</label>
                        <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full border p-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Stock *</label>
                        <input required type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="w-full border p-2 text-sm" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Categoría</label>
                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border p-2 text-sm">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Tallas (ej. S, M, L)</label>
                        <input type="text" value={formData.sizes} onChange={e => setFormData({ ...formData, sizes: e.target.value })} className="w-full border p-2 text-sm" placeholder="Separadas por comas" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase mb-1">Colores (ej. Rojo, Azul)</label>
                    <input type="text" value={formData.colors} onChange={e => setFormData({ ...formData, colors: e.target.value })} className="w-full border p-2 text-sm" placeholder="Separados por comas" />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase mb-1">Descripción</label>
                    <textarea rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border p-2 text-sm"></textarea>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase mb-2">Imagen Principal (Catálogo) *</label>
                    <div className="border border-dashed p-4 flex flex-col items-center justify-center bg-gray-50 h-32 relative">
                        {mainImagePreview ? (
                            <img src={mainImagePreview} alt="Preview" className="h-full object-contain absolute z-0 opacity-40" />
                        ) : null}
                        <input type={initialData ? "file" : "file"} required={!initialData} accept="image/*" onChange={(e) => handleImageChange(e, setMainImage, setMainImagePreview)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="flex flex-col items-center z-10 pointer-events-none text-black">
                            <Upload size={24} className="mb-2" />
                            <span className="text-sm font-semibold">Subir imagen principal</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase mb-2">Imagen Secundaria (Hover)</label>
                    <div className="border border-dashed p-4 flex flex-col items-center justify-center bg-gray-50 h-32 relative">
                        {secondImagePreview ? (
                            <img src={secondImagePreview} alt="Preview" className="h-full object-contain absolute z-0 opacity-40" />
                        ) : null}
                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setSecondImage, setSecondImagePreview)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="flex flex-col items-center z-10 pointer-events-none text-black">
                            <Upload size={24} className="mb-2" />
                            <span className="text-sm font-semibold">Subir imagen hover (Opcional)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:col-span-2 pt-4 border-t flex justify-end gap-4 mt-2">
                <button type="button" onClick={onCancel} className="px-6 py-2 border font-bold uppercase text-sm hover:bg-gray-100 transition">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-black text-white font-bold uppercase flex items-center gap-2 text-sm hover:bg-gray-800 transition">
                    <Save size={16} /> Guardar
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
