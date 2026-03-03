import React, { useEffect, useState } from 'react';
import { Product } from '@/shared/types';
import { getProducts } from '@/services/products';
import { ProductCard } from '@/shared/components/ProductCard';
import { AccessoryCard } from '@/shared/components/AccessoryCard';
import { Loader2 } from 'lucide-react';
import Header from '../shared/components/Header';
import Footer from '@/shared/components/Footer';



export const CatalogPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'coffee' | 'accessories'>('all');

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const filteredProducts = filter === 'all'
        ? products
        : products.filter(p => p.category === filter || (filter === 'coffee' && p.category === 'derivatives'));

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8 mt-20">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-[#C05D2D] tracking-[0.2em] text-sm uppercase font-medium mb-3 block">
                        Nuestra Selección
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif text-[#1C2923] mb-6">
                        Catálogo Origen
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-600 font-light">
                        Descubre los tesoros de la Sierra Nevada. Desde granos cultivados bajo sombra sagrada hasta accesorios forjados por artesanos locales.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex justify-center gap-4 mb-12">
                    {[
                        { id: 'all', label: 'Todos' },
                        { id: 'coffee', label: 'Cafés' },
                        { id: 'accessories', label: 'Accesorios' }
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id as any)}
                            className={`px-6 py-2 rounded-full text-sm tracking-wide transition-all duration-300 ${filter === f.id
                                ? 'bg-[#1C2923] text-[#D4AF37] shadow-lg scale-105'
                                : 'bg-white text-gray-500 hover:bg-[#E0A367]/10'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-[#C05D2D]" size={40} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map(product => {
                            if (product.category === 'accessories' || product.category === 'accesorios') {
                                return <AccessoryCard key={product.id} product={product} />;
                            }
                            return (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={() => console.log('Add to cart', product)}
                                />
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};
