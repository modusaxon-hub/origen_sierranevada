/**
 * Catalog PDF Generator Service
 * Origen Sierra Nevada
 * 
 * Genera PDF de catálogo dinámico con todos los productos activos
 * Se actualiza automáticamente cuando el admin agrega productos
 */

import jsPDF from 'jspdf';
import { Product, ProductCategory } from '../types';

interface CatalogOptions {
    language?: 'es' | 'en';
    includeOutOfStock?: boolean;
    title?: string;
    subtitle?: string;
}

class CatalogPdfGenerator {

    // Colores del brandbook
    private colors = {
        primary: '#C8AA6E',      // Gold
        background: '#050806',   // Dark Green
        secondary: '#141E16',    // Medium Green
        text: '#F5F5F5',         // Off-white
        textMuted: 'rgba(245, 245, 245, 0.7)'
    };

    /**
     * Genera PDF del catálogo completo
     */
    async generateCatalog(products: Product[], options: CatalogOptions = {}): Promise<Blob> {
        const {
            language = 'es',
            includeOutOfStock = false,
            title = 'Catálogo de Café Premium',
            subtitle = 'Origen Sierra Nevada • Cosecha 2026'
        } = options;

        // Filtrar productos
        const activeProducts = products.filter(p =>
            p.available && (includeOutOfStock || p.stock > 0)
        );

        // Agrupar por categoría
        const grouped = this.groupByCategory(activeProducts);

        // Crear PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        let yPosition = 20;

        // Portada
        yPosition = this.addCoverPage(pdf, title, subtitle, language);

        // Página de introducción
        pdf.addPage();
        yPosition = 20;
        yPosition = this.addIntroduction(pdf, yPosition, language);

        // Productos por categoría
        for (const [category, categoryProducts] of Object.entries(grouped)) {
            pdf.addPage();
            yPosition = 20;
            yPosition = this.addCategorySection(pdf, category as ProductCategory, categoryProducts, yPosition, language);
        }

        // Página final (contacto)
        pdf.addPage();
        this.addContactPage(pdf, language);

        // Convertir a Blob
        return pdf.output('blob');
    }

    /**
     * Agrupa productos por categoría
     */
    private groupByCategory(products: Product[]): Record<ProductCategory, Product[]> {
        const grouped: Partial<Record<ProductCategory, Product[]>> = {};

        products.forEach(product => {
            if (!grouped[product.category]) {
                grouped[product.category] = [];
            }
            grouped[product.category]!.push(product);
        });

        return grouped as Record<ProductCategory, Product[]>;
    }

    /**
     * Agrega portada
     */
    private addCoverPage(pdf: jsPDF, title: string, subtitle: string, language: string): number {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Fondo oscuro (simulado con rectángulo)
        pdf.setFillColor(5, 8, 6);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');

        // Logo (texto por ahora, TODO: agregar imagen)
        pdf.setTextColor(200, 170, 110);
        pdf.setFontSize(42);
        pdf.setFont('helvetica', 'bold');
        const titleWidth = pdf.getTextWidth('ORIGEN');
        pdf.text('ORIGEN', (pageWidth - titleWidth) / 2, 80);

        pdf.setFontSize(28);
        const subtitleLogoWidth = pdf.getTextWidth('Sierra Nevada');
        pdf.text('Sierra Nevada', (pageWidth - subtitleLogoWidth) / 2, 95);

        // Línea decorativa
        pdf.setDrawColor(200, 170, 110);
        pdf.setLineWidth(0.5);
        pdf.line(pageWidth / 2 - 30, 105, pageWidth / 2 + 30, 105);

        // Título del catálogo
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'normal');
        const catalogTitleWidth = pdf.getTextWidth(title);
        pdf.text(title, (pageWidth - catalogTitleWidth) / 2, 130);

        // Subtítulo
        pdf.setFontSize(12);
        pdf.setTextColor(245, 245, 245);
        const subtitleWidth = pdf.getTextWidth(subtitle);
        pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, 140);

        // Año
        pdf.setFontSize(10);
        pdf.setTextColor(200, 170, 110);
        const year = new Date().getFullYear().toString();
        const yearWidth = pdf.getTextWidth(year);
        pdf.text(year, (pageWidth - yearWidth) / 2, pageHeight - 30);

        return pageHeight;
    }

    /**
     * Agrega página de introducción
     */
    private addIntroduction(pdf: jsPDF, yPos: number, language: string): number {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 20;

        pdf.setTextColor(200, 170, 110);
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');

        const introTitle = language === 'es'
            ? 'Nuestro Café'
            : 'Our Coffee';

        pdf.text(introTitle, margin, yPos);
        yPos += 15;

        // Línea decorativa
        pdf.setDrawColor(200, 170, 110);
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPos, margin + 40, yPos);
        yPos += 10;

        // Texto de introducción
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(245, 245, 245);

        const introText = language === 'es'
            ? `Cultivado en las laderas de la Sierra Nevada de Santa Marta, entre 1,200 y 1,800 
metros sobre el nivel del mar, nuestro café es el resultado de un ecosistema único.

Cada grano es cuidadosamente seleccionado a mano, procesado artesanalmente y 
tostado en pequeños lotes para preservar su perfil sensorial excepcional.

Este catálogo presenta nuestra selección actual de cafés de especialidad, cada uno 
con su propia historia y carácter distintivo.`
            : `Grown on the slopes of the Sierra Nevada de Santa Marta, between 1,200 and 1,800 
meters above sea level, our coffee is the result of a unique ecosystem.

Each bean is carefully hand-selected, artisanally processed, and roasted in small 
batches to preserve its exceptional sensory profile.

This catalog presents our current selection of specialty coffees, each with its own 
story and distinctive character.`;

        const splitText = pdf.splitTextToSize(introText, pageWidth - 2 * margin);
        pdf.text(splitText, margin, yPos);
        yPos += splitText.length * 6 + 10;

        return yPos;
    }

    /**
     * Agrega sección de categoría con productos
     */
    private addCategorySection(
        pdf: jsPDF,
        category: ProductCategory,
        products: Product[],
        yPos: number,
        language: string
    ): number {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;

        // Título de categoría
        pdf.setTextColor(200, 170, 110);
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');

        const categoryName = this.getCategoryName(category, language);
        pdf.text(categoryName, margin, yPos);
        yPos += 10;

        // Línea divisoria
        pdf.setDrawColor(200, 170, 110);
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;

        // Productos
        for (const product of products) {
            // Verificar si necesitamos nueva página
            if (yPos > pageHeight - 60) {
                pdf.addPage();
                yPos = 20;
            }

            yPos = this.addProductCard(pdf, product, yPos, language);
            yPos += 5; // Espacio entre productos
        }

        return yPos;
    }

    /**
     * Agrega tarjeta de producto
     */
    private addProductCard(pdf: jsPDF, product: Product, yPos: number, language: string): number {
        const margin = 20;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const cardWidth = pageWidth - 2 * margin;

        // Nombre del producto
        pdf.setTextColor(245, 245, 245);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        const productName = typeof product.name === 'string'
            ? product.name
            : product.name[language] || product.name.es;
        pdf.text(productName, margin, yPos);
        yPos += 7;

        // Precio
        pdf.setTextColor(200, 170, 110);
        pdf.setFontSize(12);
        pdf.text(`$${product.price.toFixed(2)} USD`, margin, yPos);
        yPos += 7;

        // Descripción
        pdf.setTextColor(245, 245, 245);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        const description = typeof product.description === 'string'
            ? product.description
            : product.description[language] || product.description.es;

        const splitDesc = pdf.splitTextToSize(description, cardWidth - 10);
        pdf.text(splitDesc, margin, yPos);
        yPos += splitDesc.length * 4 + 3;

        // Características (Peso, Origen, Stock)
        pdf.setFontSize(8);
        pdf.setTextColor(200, 170, 110);

        const details = language === 'es'
            ? `Peso: ${product.weight}g | Origen: ${product.origin} | Stock: ${product.stock > 0 ? 'Disponible' : 'Agotado'}`
            : `Weight: ${product.weight}g | Origin: ${product.origin} | Stock: ${product.stock > 0 ? 'Available' : 'Out of Stock'}`;

        pdf.text(details, margin, yPos);
        yPos += 8;

        // Línea divisoria sutil
        pdf.setDrawColor(200, 170, 110);
        pdf.setLineWidth(0.1);
        pdf.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 5;

        return yPos;
    }

    /**
     * Agrega página de contacto
     */
    private addContactPage(pdf: jsPDF, language: string): void {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Fondo oscuro
        pdf.setFillColor(5, 8, 6);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');

        let yPos = 80;

        // Título
        pdf.setTextColor(200, 170, 110);
        pdf.setFontSize(28);
        pdf.setFont('helvetica', 'bold');

        const title = language === 'es' ? 'Contáctanos' : 'Contact Us';
        const titleWidth = pdf.getTextWidth(title);
        pdf.text(title, (pageWidth - titleWidth) / 2, yPos);
        yPos += 20;

        // Información de contacto
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(245, 245, 245);

        const contacts = [
            'Email: cafemalusm@gmail.com',
            'WhatsApp: +57 300 123 4567',
            'Instagram: @origensierranevada',
            '',
            'Sierra Nevada de Santa Marta',
            'Colombia'
        ];

        contacts.forEach(line => {
            const lineWidth = pdf.getTextWidth(line);
            pdf.text(line, (pageWidth - lineWidth) / 2, yPos);
            yPos += 8;
        });

        yPos += 10;

        // URL del sitio web
        pdf.setTextColor(200, 170, 110);
        pdf.setFontSize(10);
        const url = 'https://origen2025.share.zrok.io';
        const urlWidth = pdf.getTextWidth(url);
        pdf.text(url, (pageWidth - urlWidth) / 2, yPos);
    }

    /**
     * Obtiene nombre de categoría traducido
     */
    private getCategoryName(category: ProductCategory, language: string): string {
        const translations: Record<ProductCategory, { es: string; en: string }> = {
            'cafetal': { es: 'Cafetal Premium', en: 'Premium Coffee' },
            'accesorios': { es: 'Accesorios de Café', en: 'Coffee Accessories' },
            'antojitos': { es: 'Antojitos & Delicias', en: 'Treats & Delicacies' }
        };

        return translations[category]?.[language] || category;
    }

    /**
     * Genera PDF y lo descarga automáticamente
     */
    async downloadCatalog(products: Product[], options: CatalogOptions = {}): Promise<void> {
        const blob = await this.generateCatalog(products, options);

        // Crear enlace de descarga
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `origen-sierra-nevada-catalog-${new Date().getFullYear()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Sube PDF a Supabase Storage (para usar en emails)
     */
    async uploadToStorage(blob: Blob, fileName: string): Promise<string | null> {
        // TODO: Implementar subida a Supabase Storage
        // Esta función permitirá que el catálogo esté disponible públicamente
        // para incluir en emails
        console.log('Upload to storage not yet implemented');
        return null;
    }
}

// Exportar instancia singleton
export const catalogPdfService = new CatalogPdfGenerator();
export default catalogPdfService;
