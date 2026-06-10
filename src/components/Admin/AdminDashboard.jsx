import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import CategoryForm from './CategoryForm';
import HeroSlideForm from './HeroSlideForm';
import ManifestoForm from './ManifestoForm';
import SiteSettingsForm from './SiteSettingsForm';
import EditorialSettingsForm from './EditorialSettingsForm';
import OrdersTab from './OrdersTab';
import { Plus, Edit2, Trash2, Tag, Box, Images, BookOpen, Settings, LayoutTemplate, ShoppingCart } from 'lucide-react';
import { API_BASE_URL } from '../../api/config';

const AdminDashboard = () => {
    const { token, logout, getAuthHeaders } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [heroSlides, setHeroSlides] = useState([]);
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('adminActiveTab') || 'products';
    });

    useEffect(() => {
        localStorage.setItem('adminActiveTab', activeTab);
    }, [activeTab]);

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showSlideForm, setShowSlideForm] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = products.filter(product => {
        const query = searchQuery.toLowerCase();
        return (
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    });

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/products`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (err) {
            console.error("Error al obtener productos:", err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (err) {
            console.error("Error al obtener categorías:", err);
        }
    };

    const fetchHeroSlides = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/hero-slides`);
            if (res.ok) {
                const data = await res.json();
                setHeroSlides(data);
            }
        } catch (err) {
            console.error("Error al obtener slides:", err);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/admin/login');
        } else {
            fetchProducts();
            fetchCategories();
            fetchHeroSlides();
        }
    }, [token, navigate]);
    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
            try {
                const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
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

    const handleDeleteCategory = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar esta categoría? Si tiene productos asignados, seguirán existiendo pero con categoría 'General'.")) {
            try {
                const res = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                });
                if (res.ok) {
                    fetchCategories();
                } else {
                    alert("Error eliminando la categoría");
                }
            } catch (err) {
                console.error("Error de conexión:", err);
            }
        }
    };

    const handleEditCategoryClick = (category) => {
        setEditingCategory(category);
        setShowCategoryForm(true);
    };

    const handleAddNewCategoryClick = () => {
        setEditingCategory(null);
        setShowCategoryForm(true);
    };

    const handleDeleteSlide = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este slide?")) {
            try {
                const res = await fetch(`${API_BASE_URL}/admin/hero-slides/${id}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                });
                if (res.ok) {
                    fetchHeroSlides();
                } else {
                    alert("Error eliminando el slide");
                }
            } catch (err) {
                console.error("Error de conexión:", err);
            }
        }
    };

    const handleEditSlideClick = (slide) => {
        setEditingSlide(slide);
        setShowSlideForm(true);
    };

    const handleAddNewSlideClick = () => {
        setEditingSlide(null);
        setShowSlideForm(true);
    };

    const resolveImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${API_BASE_URL}${encodeURI(url)}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <h1 className="text-2xl sm:text-3xl font-header font-bold uppercase tracking-wider">Panel de Administración</h1>
                    <button onClick={logout} className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-black transition">
                        Cerrar Sesión
                    </button>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b overflow-hidden">
                    <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-2 -mb-px">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`font-bold uppercase tracking-wider text-xs sm:text-sm pb-2 border-b-2 flex items-center gap-2 transition whitespace-nowrap flex-shrink-0 min-w-max ${activeTab === 'products' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
                        >
                            <Box size={16} /> Productos
                        </button>
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={`font-bold uppercase tracking-wider text-xs sm:text-sm pb-2 border-b-2 flex items-center gap-2 transition whitespace-nowrap flex-shrink-0 min-w-max ${activeTab === 'categories' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
                        >
                            <Tag size={16} /> Categorías
                        </button>
                        <button
                            onClick={() => setActiveTab('hero-slides')}
                            className={`font-bold uppercase tracking-wider text-xs sm:text-sm pb-2 border-b-2 flex items-center gap-2 transition whitespace-nowrap flex-shrink-0 min-w-max ${activeTab === 'hero-slides' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
                        >
                            <Images size={16} /> Slider Principal
                        </button>
                        <button
                            onClick={() => setActiveTab('manifesto')}
                            className={`font-bold uppercase tracking-wider text-xs sm:text-sm pb-2 border-b-2 flex items-center gap-2 transition whitespace-nowrap flex-shrink-0 min-w-max ${activeTab === 'manifesto' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
                        >
                            <BookOpen size={16} /> Manifiesto
                        </button>
                        <button
                            onClick={() => setActiveTab('site-settings')}
                            className={`font-bold uppercase tracking-wider text-xs sm:text-sm pb-2 border-b-2 flex items-center gap-2 transition whitespace-nowrap flex-shrink-0 min-w-max ${activeTab === 'site-settings' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
                        >
                            <Settings size={16} /> Textos Tienda
                        </button>
                        <button
                            onClick={() => setActiveTab('editorial')}
                            className={`font-bold uppercase tracking-wider text-xs sm:text-sm pb-2 border-b-2 flex items-center gap-2 transition whitespace-nowrap flex-shrink-0 min-w-max ${activeTab === 'editorial' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
                        >
                            <LayoutTemplate size={16} /> Editorial
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`font-bold uppercase tracking-wider text-xs sm:text-sm pb-2 border-b-2 flex items-center gap-2 transition whitespace-nowrap flex-shrink-0 min-w-max ${activeTab === 'orders' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
                        >
                            <ShoppingCart size={16} /> Pedidos
                        </button>
                    </div>
                </div>

                {activeTab === 'products' && (
                    showForm ? (
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
                            <div className="p-4 border-b flex flex-col sm:flex-row sm:justify-between bg-gray-100 sm:items-center gap-4">
                                <h2 className="font-header font-bold uppercase min-w-max">Inventario de Productos</h2>
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                    <input
                                        type="text"
                                        placeholder="Buscar producto por nombre..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-black"
                                    />
                                    <button onClick={handleAddNewClick} className="bg-black text-white px-4 py-2 text-sm font-bold uppercase flex items-center justify-center gap-2 hover:bg-gray-800 transition min-w-max w-full sm:w-auto">
                                        <Plus size={16} /> Nuevo
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Imágenes</th>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Nombre</th>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Categoría / Tallas</th>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Precio</th>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Stock</th>
                                            <th className="px-6 py-4 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filteredProducts.map(product => {
                                            let images = [];
                                            try {
                                                images = JSON.parse(product.images || '[]');
                                            } catch (e) { }

                                            const totalStock = product.variants ? product.variants.reduce((acc, curr) => acc + curr.stock, 0) : 0;
                                            const uniqueSizes = (product.variants && product.variants.length > 0)
                                                ? Array.from(new Set(product.variants.map(v => v.size))).filter(Boolean).join(', ')
                                                : 'N/A';

                                            return (
                                                <tr key={product.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2 items-center">
                                                            {images.length > 0 ? (
                                                                <>
                                                                    <img src={resolveImageUrl(images[0])} alt="Principal" className="w-12 h-12 object-cover border rounded-sm shadow-sm" title="Imagen Principal" />
                                                                    {images.length > 1 && <span className="text-xs font-bold text-gray-400">+{images.length - 1}</span>}
                                                                </>
                                                            ) : <span className="text-gray-400 text-xs">Sin imagen</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium">{product.name}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold">{product.category}</div>
                                                        <div className="text-xs text-gray-500">{uniqueSizes || 'N/A'}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {product.is_offer ? (
                                                            <div className="flex flex-col">
                                                                <span className="text-purple-600 font-bold">S/ {product.offer_price?.toFixed(2)}</span>
                                                                <span className="text-gray-400 text-[10px] line-through">S/ {product.price.toFixed(2)}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="font-medium">S/ {product.price.toFixed(2)}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold">{totalStock}</div>
                                                        <div className="text-[10px] text-gray-500">{product.variants?.length || 0} variantes</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-3">
                                                        <button onClick={() => handleEditClick(product)} className="text-gray-500 hover:text-black transition">
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-600 transition">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {filteredProducts.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                    {products.length === 0 ? "No hay productos en inventario." : "No se encontraron productos que coincidan con la búsqueda."}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                )}

                {activeTab === 'categories' && (
                    showCategoryForm ? (
                        <div className="mb-8">
                            <CategoryForm
                                initialData={editingCategory}
                                onSaved={() => {
                                    setShowCategoryForm(false);
                                    fetchCategories();
                                }}
                                onCancel={() => setShowCategoryForm(false)}
                            />
                        </div>
                    ) : (
                        <div className="bg-white shadow rounded-lg overflow-hidden border">
                            <div className="p-4 border-b flex flex-col sm:flex-row sm:justify-between bg-gray-100 sm:items-center gap-4">
                                <h2 className="font-header font-bold uppercase min-w-max">Gestión de Categorías</h2>
                                <button onClick={handleAddNewCategoryClick} className="bg-black text-white px-4 py-2 text-sm font-bold uppercase flex items-center justify-center gap-2 hover:bg-gray-800 transition min-w-max w-full sm:w-auto">
                                    <Plus size={16} /> Nueva Categoría
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Imagen (Cover)</th>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Nombre</th>
                                            <th className="px-6 py-4 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {categories.map(cat => (
                                            <tr key={cat.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4">
                                                    {cat.image_url ? (
                                                        <img src={resolveImageUrl(cat.image_url)} alt={cat.name} className="w-12 h-16 object-cover border rounded-sm" />
                                                    ) : (
                                                        <span className="text-gray-400 text-[10px] uppercase font-bold text-center border p-2 bg-gray-100 flex items-center justify-center w-12 h-16">Sin img</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-bold uppercase text-xs tracking-wider">{cat.name}</td>
                                                <td className="px-6 py-4 text-right border-l w-32">
                                                    <div className="flex justify-end gap-3 h-full items-center">
                                                        <button onClick={() => handleEditCategoryClick(cat)} className="text-gray-500 hover:text-black transition">
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-400 hover:text-red-600 transition">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {categories.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-8 text-center text-gray-500 text-sm italic">
                                                    No hay categorías registradas.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                )}

                {activeTab === 'hero-slides' && (
                    showSlideForm ? (
                        <div className="mb-8">
                            <HeroSlideForm
                                initialData={editingSlide}
                                onSaved={() => {
                                    setShowSlideForm(false);
                                    fetchHeroSlides();
                                }}
                                onCancel={() => setShowSlideForm(false)}
                            />
                        </div>
                    ) : (
                        <div className="bg-white shadow rounded-lg overflow-hidden border">
                            <div className="p-4 border-b flex flex-col sm:flex-row sm:justify-between bg-gray-100 sm:items-center gap-4">
                                <h2 className="font-header font-bold uppercase min-w-max">Gestión de Slider Principal</h2>
                                <button onClick={handleAddNewSlideClick} className="bg-black text-white px-4 py-2 text-sm font-bold uppercase flex items-center justify-center gap-2 hover:bg-gray-800 transition min-w-max w-full sm:w-auto">
                                    <Plus size={16} /> Nuevo Slide
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Fondo</th>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Textos</th>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Botón (CTA)</th>
                                            <th className="px-6 py-4 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {heroSlides.map(slide => (
                                            <tr key={slide.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4">
                                                    {slide.image_url ? (
                                                        <img src={resolveImageUrl(slide.image_url)} alt="Slide bg" className="w-24 h-16 object-cover border rounded-sm" />
                                                    ) : (
                                                        <span className="text-gray-400 text-[10px] uppercase font-bold text-center border p-2 bg-gray-100 flex items-center justify-center w-24 h-16">Sin img</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold uppercase text-xs tracking-wider mb-1">{slide.title}</div>
                                                    <div className="text-gray-500 text-xs italic">{slide.subtitle}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold uppercase text-xs tracking-wider text-purple-600 mb-1">{slide.cta_text}</div>
                                                    <div className="text-gray-500 text-[10px] truncate max-w-[150px]" title={slide.cta_url || 'Sin URL'}>{slide.cta_url || 'Sin URL'}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right border-l w-32">
                                                    <div className="flex justify-end gap-3 h-full items-center">
                                                        <button onClick={() => handleEditSlideClick(slide)} className="text-gray-500 hover:text-black transition">
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button onClick={() => handleDeleteSlide(slide.id)} className="text-red-400 hover:text-red-600 transition">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {heroSlides.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-sm italic">
                                                    No hay slides configurados. El slider inicial podría verse vacío.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                )}

                {activeTab === 'manifesto' && (
                    <ManifestoForm />
                )}

                {activeTab === 'site-settings' && (
                    <div className="max-w-4xl mx-auto">
                        <SiteSettingsForm />
                    </div>
                )}

                {activeTab === 'editorial' && (
                    <EditorialSettingsForm />
                )}

                {activeTab === 'orders' && (
                    <OrdersTab />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
