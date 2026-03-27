import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Upload, X, Save, Plus, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../api/config';

const ProductForm = ({ onSaved, onCancel, initialData = null }) => {
    const { getAuthHeaders } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'General',
        related_product_id: '',
    });

    const [allProducts, setAllProducts] = useState([]);

    // Variants instead of global stock/sizes/colors
    const [variants, setVariants] = useState([]);

    // Images array
    const [images, setImages] = useState([]); // [{file: File|null, preview: 'url'}]

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/categories`);
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
        fetchCategories();

        const fetchAllProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/products`);
                if (res.ok) {
                    const data = await res.json();
                    setAllProducts(data);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };
        fetchAllProducts();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                price: initialData.price || '',
                description: initialData.description || '',
                category: initialData.category || 'General',
                related_product_id: initialData.related_product_id || '',
            });

            if (initialData.variants) {
                setVariants(initialData.variants.map(v => ({ ...v })));
            }

            if (initialData.images) {
                try {
                    const parsed = JSON.parse(initialData.images);
                    const loadedImages = parsed.map(url => ({
                        file: null,
                        preview: url.startsWith('http') ? url : `${API_BASE_URL}${url}`
                    }));
                    setImages(loadedImages);
                } catch (e) { }
            }
        }
    }, [initialData]);

    const handleAddImage = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => {
            const preview = URL.createObjectURL(file);
            return { file, preview };
        });
        setImages([...images, ...newImages]);
    };

    const handleRemoveImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleAddVariant = () => {
        setVariants([...variants, { size: '', color: '', color_hex: '#FFFFFF', stock: 0 }]);
    };

    const handleRemoveVariant = (index) => {
        const newVariants = [...variants];
        newVariants.splice(index, 1);
        setVariants(newVariants);
    };

    const updateVariant = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const uploadImage = async (file) => {
        if (!file) return null;
        const imgData = new FormData();
        imgData.append('file', file);

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

        // 1. Upload new images and collect all URLs
        const finalImageUrls = [];
        for (const img of images) {
            if (img.file) {
                const url = await uploadImage(img.file);
                if (url) finalImageUrls.push(url);
            } else {
                // Keep existing url but strip localhost domain if needed
                const url = img.preview.replace(API_BASE_URL, '').replace('http://localhost:8080', '');
                finalImageUrls.push(url);
            }
        }

        const payload = {
            name: formData.name,
            price: parseFloat(formData.price),
            description: formData.description,
            category: formData.category,
            related_product_id: formData.related_product_id || null,
            images: finalImageUrls,
            variants: variants.map(v => ({
                size: v.size,
                color: v.color,
                color_hex: v.color_hex || '#FFFFFF',
                stock: parseInt(v.stock) || 0
            }))
        };

        const method = initialData ? 'PUT' : 'POST';
        const url = initialData
            ? `${API_BASE_URL}/admin/products/${initialData.id}`
            : `${API_BASE_URL}/admin/products`;

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
                        <label className="block text-xs font-bold uppercase mb-1">Categoría</label>
                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border p-2 text-sm">
                            <option value="General">General</option>
                            {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase mb-1">Descripción</label>
                    <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border p-2 text-sm"></textarea>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase mb-1">Producto Relacionado (Shop the Look)</label>
                    <select 
                        value={formData.related_product_id} 
                        onChange={e => setFormData({ ...formData, related_product_id: e.target.value })} 
                        className="w-full border p-2 text-sm"
                    >
                        <option value="">Ninguno</option>
                        {allProducts
                            .filter(p => !initialData || p.id !== initialData.id)
                            .map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))
                        }
                    </select>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase italic">
                        Selecciona un producto para mostrarlo como una recomendación de estilo en la página de este producto.
                    </p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold uppercase">Variantes (Talla y Color) *</label>
                        <button type="button" onClick={handleAddVariant} className="text-xs font-bold uppercase border px-2 py-1 flex items-center gap-1 hover:bg-gray-100">
                            <Plus size={14} /> Agregar Variante
                        </button>
                    </div>
                    {variants.length === 0 && <p className="text-xs text-red-500 mb-2">Debes agregar al menos una variante de stock.</p>}

                    <div className="space-y-2">
                        {variants.map((v, i) => (
                            <div key={i} className="flex flex-wrap md:flex-nowrap gap-2 items-center bg-gray-50 p-2 border">
                                <input required type="text" placeholder="Talla (ej. S, 39, Única)" value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} className="w-[80px] md:w-1/4 border p-2 text-sm" />
                                <input required type="text" placeholder="Color (ej. Rojo)" value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)} className="flex-1 md:w-1/3 border p-2 text-sm" />

                                <div className="flex items-center gap-1 border bg-white p-1" title="Color visual (Hex)">
                                    <input type="color" value={v.color_hex || '#FFFFFF'} onChange={e => updateVariant(i, 'color_hex', e.target.value)} className="w-8 h-8 cursor-pointer p-0 border-none bg-transparent" />
                                </div>

                                <input required type="number" min="0" placeholder="Stock" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} className="w-[70px] border p-2 text-sm" />
                                <button type="button" onClick={() => handleRemoveVariant(i)} className="text-red-500 p-2 hover:bg-red-50 transition">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold uppercase mb-2">Imágenes del Producto *</label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                        {images.map((img, i) => (
                            <div key={i} className="border relative group h-24 bg-gray-50 flex justify-center items-center">
                                <img src={img.preview} alt="preview" className="h-full object-contain" />
                                <button type="button" onClick={() => handleRemoveImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow">
                                    <X size={12} />
                                </button>
                                {i === 0 && <span className="absolute bottom-1 left-1 bg-black text-white text-[10px] px-1 uppercase font-bold">Principal</span>}
                            </div>
                        ))}
                    </div>

                    <div className="border border-dashed p-4 flex flex-col items-center justify-center bg-gray-50 h-32 relative hover:bg-gray-100 transition cursor-pointer">
                        <input type="file" multiple accept="image/*" onChange={handleAddImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="flex flex-col items-center z-10 pointer-events-none text-black">
                            <Upload size={24} className="mb-2" />
                            <span className="text-sm font-semibold">Agregar imágenes</span>
                        </div>
                    </div>
                    {images.length === 0 && <p className="text-xs text-red-500 mt-1">Sube al menos 1 imagen principal.</p>}
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
