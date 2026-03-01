import React, { useState } from 'react';
import { Download, FileText, Loader2, CheckCircle } from 'lucide-react';
import catalogPdfService from '../services/catalogPdfService';
import { productService } from '../services/productService';
import { Product } from '../types';

/**
 * Componente para generar y descargar catálogo PDF
 * Solo disponible para administradores
 */
export const CatalogDownloadButton: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateCatalog = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Obtener todos los productos
            const { data: products, error: fetchError } = await productService.getAllProducts();

            if (fetchError) {
                throw new Error('Error al obtener productos');
            }

            if (!products || products.length === 0) {
                throw new Error('No hay productos disponibles para el catálogo');
            }

            // Generar y descargar PDF
            await catalogPdfService.downloadCatalog(products as Product[], {
                language: 'es',
                includeOutOfStock: false,
                title: 'Catálogo de Café Premium',
                subtitle: `Origen Sierra Nevada • Cosecha ${new Date().getFullYear()}`
            });

            setSuccess(true);

            // Resetear estado después de 3 segundos
            setTimeout(() => {
                setSuccess(false);
            }, 3000);

        } catch (err) {
            console.error('Error generando catálogo:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="catalog-download-section">
            <button
                onClick={handleGenerateCatalog}
                disabled={loading}
                className="catalog-download-btn"
            >
                {loading ? (
                    <>
                        <Loader2 className="icon-spin" size={20} />
                        <span>Generando PDF...</span>
                    </>
                ) : success ? (
                    <>
                        <CheckCircle size={20} />
                        <span>¡Descargado!</span>
                    </>
                ) : (
                    <>
                        <Download size={20} />
                        <span>Descargar Catálogo PDF</span>
                    </>
                )}
            </button>

            {error && (
                <div className="error-message">
                    <p>❌ {error}</p>
                </div>
            )}

            <style>{`
                .catalog-download-section {
                    margin: 20px 0;
                }

                .catalog-download-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #C8AA6E 0%, #A08856 100%);
                    color: #050806;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .catalog-download-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 16px rgba(200, 170, 110, 0.3);
                }

                .catalog-download-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .icon-spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                .error-message {
                    margin-top: 10px;
                    padding: 10px;
                    background: rgba(255, 82, 82, 0.1);
                    border: 1px solid rgba(255, 82, 82, 0.3);
                    border-radius: 4px;
                }

                .error-message p {
                    margin: 0;
                    color: #FF5252;
                    font-size: 13px;
                }
            `}</style>
        </div>
    );
};

/**
 * Componente informativo sobre el catálogo
 * Para mostrar en el dashboard de admin
 */
export const CatalogInfo: React.FC = () => {
    return (
        <div className="catalog-info-card">
            <div className="catalog-info-header">
                <FileText size={24} />
                <h3>Catálogo PDF Automático</h3>
            </div>

            <p className="catalog-info-description">
                El catálogo PDF se genera automáticamente con todos los productos activos,
                organizados por categoría. Ideal para compartir con clientes o en redes sociales.
            </p>

            <div className="catalog-features">
                <div className="feature">
                    <span className="feature-icon">✅</span>
                    <span>Se actualiza automáticamente al agregar productos</span>
                </div>
                <div className="feature">
                    <span className="feature-icon">🎨</span>
                    <span>Diseño premium con brandbook de Origen</span>
                </div>
                <div className="feature">
                    <span className="feature-icon">🌐</span>
                    <span>Disponible en español e inglés</span>
                </div>
                <div className="feature">
                    <span className="feature-icon">📧</span>
                    <span>Incluido automáticamente en emails de bienvenida</span>
                </div>
            </div>

            <CatalogDownloadButton />

            <style>{`
                .catalog-info-card {
                    background: #141E16;
                    border: 1px solid rgba(200, 170, 110, 0.2);
                    border-radius: 12px;
                    padding: 24px;
                    margin: 20px 0;
                }

                .catalog-info-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .catalog-info-header svg {
                    color: #C8AA6E;
                }

                .catalog-info-header h3 {
                    margin: 0;
                    color: #C8AA6E;
                    font-size: 20px;
                    font-weight: 600;
                }

                .catalog-info-description {
                    color: rgba(245, 245, 245, 0.7);
                    line-height: 1.6;
                    margin-bottom: 20px;
                    font-size: 14px;
                }

                .catalog-features {
                    display: grid;
                    gap: 12px;
                    margin-bottom: 24px;
                }

                .feature {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 13px;
                    color: rgba(245, 245, 245, 0.8);
                }

                .feature-icon {
                    font-size: 16px;
                }
            `}</style>
        </div>
    );
};

export default CatalogDownloadButton;
