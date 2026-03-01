import React, { useEffect, useState } from 'react';
import { Product } from '../../types';
import { getProducts, deleteProduct } from '../../services/products';
import { ProductForm } from '../../components/admin/ProductForm';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.')) return;

        try {
            await deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            alert('Error al eliminar producto');
        }
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setView('edit');
    };

    if (view === 'create' || view === 'edit') {
        return (
            <div className="container mx-auto px-4 py-8">
                <ProductForm
                    initialData={selectedProduct}
                    onCancel={() => {
                        setView('list');
                        setSelectedProduct(undefined);
                    }}
                    onSuccess={() => {
                        loadProducts();
                        setView('list');
                        setSelectedProduct(undefined);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif text-[#1C2923]">Gestión de Productos</h1>
                    <p className="text-gray-600">Administra tu catálogo de café y accesorios</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedProduct(undefined);
                        setView('create');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#C05D2D] text-white rounded-lg hover:bg-[#A04D25] transition-colors shadow-lg"
                >
                    <Plus size={20} />
                    Nuevo Producto
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-gray-400">Cargando productos...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">No hay productos en el catálogo.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#1C2923] text-[#D4AF37]">
                            <tr>
                                <th className="p-4 font-medium">Nombre (ES)</th>
                                <th className="p-4 font-medium">Categoría</th>
                                <th className="p-4 font-medium">Precio</th>
                                <th className="p-4 font-medium">Stock</th>
                                <th className="p-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 flex items-center gap-3">
                                        <img
                                            src={product.image_url}
                                            alt=""
                                            className="w-10 h-10 object-contain bg-gray-100 rounded"
                                        />
                                        <span className="font-medium text-gray-800">{product.name.es}</span>
                                    </td>
                                    <td className="p-4 text-gray-600 capitalize">{product.category}</td>
                                    <td className="p-4 text-gray-800">${product.price.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.stock} un.
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-2 text-gray-500 hover:text-[#C05D2D] hover:bg-[#C05D2D]/10 rounded-full transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
