import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * Edge Function: Generate Catalog PDF
 * 
 * Se ejecuta automáticamente cuando se agrega/modifica un producto
 * Genera PDF del catálogo y lo sube a Supabase Storage
 */

serve(async (req) => {
  try {
    //  authHeader
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Obtener todos los productos activos
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('available', true)
      .order('category', { ascending: true })
      .order('name->es', { ascending: true })

    if (productsError) {
      throw productsError
    }

    // Generar HTML del catálogo (versión web para convertir a PDF)
    const catalogHtml = generateCatalogHtml(products)

    // TODO: Convertir HTML a PDF usando una librería como Puppeteer/Playwright
    // Por ahora, guardar HTML

    // Subir a Supabase Storage
    const fileName = `catalog-${new Date().getFullYear()}-${new Date().getMonth() + 1}.html`

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('catalogs')
      .upload(fileName, new Blob([catalogHtml], { type: 'text/html' }), {
        contentType: 'text/html',
        upsert: true
      })

    if (uploadError) {
      throw uploadError
    }

    // Obtener URL pública
    const { data: { publicUrl } } = supabase
      .storage
      .from('catalogs')
      .getPublicUrl(fileName)

    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        productsCount: products.length,
        generatedAt: new Date().toISOString()
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )

  } catch (error: any) {
    console.error('Error generating catalog:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})

/**
 * Genera HTML del catálogo (temporal hasta implementar PDF)
 */
function generateCatalogHtml(products: any[]): string {
  const groupedByCategory = products.reduce((acc: any, product: any) => {
    if (!acc[product.category]) {
      acc[product.category] = []
    }
    acc[product.category].push(product)
    return acc
  }, {})

  const categoryNames: Record<string, string> = {
    'cafetal': 'Cafetal Premium',
    'accesorios': 'Accesorios de Café',
    'antojitos': 'Antojitos & Delicias'
  }

  const productCards = Object.entries(groupedByCategory).map(([category, categoryProducts]: [string, any]) => `
    <div class="category-section">
      <h2 class="category-title">${categoryNames[category] || category}</h2>
      <div class="products-grid">
        ${(categoryProducts as any[]).map((p: any) => `
          <div class="product-card">
            ${p.image_url ? `<img src="${p.image_url}" alt="${p.name.es}" class="product-image">` : ''}
            <h3 class="product-name">${p.name.es}</h3>
            <p class="product-price">$${p.price.toFixed(2)} USD</p>
            <p class="product-description">${p.description.es}</p>
            <div class="product-meta">
              <span>Peso: ${p.weight}g</span>
              <span>Origen: ${p.origin}</span>
              <span class="${p.stock > 0 ? 'in-stock' : 'out-stock'}">
                ${p.stock > 0 ? 'Disponible' : 'Agotado'}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('')

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Catálogo Origen Sierra Nevada ${new Date().getFullYear()}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Montserrat', sans-serif;
      background: #050806;
      color: #F5F5F5;
      line-height: 1.6;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .header {
      text-align: center;
      padding: 60px 0;
      border-bottom: 1px solid rgba(200, 170, 110, 0.3);
    }

    .logo {
      font-family: 'Playfair Display', serif;
      font-size: 48px;
      font-weight: 700;
      color: #C8AA6E;
      margin-bottom: 10px;
    }

    .subtitle {
      font-size: 18px;
      color: rgba(245, 245, 245, 0.7);
      letter-spacing: 2px;
    }

    .category-section {
      margin: 60px 0;
    }

    .category-title {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      color: #C8AA6E;
      margin-bottom: 30px;
      border-bottom: 2px solid rgba(200, 170, 110, 0.2);
      padding-bottom: 10px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
    }

    .product-card {
      background: #141E16;
      border-radius: 8px;
      padding: 20px;
      border: 1px solid rgba(200, 170, 110, 0.1);
      transition: transform 0.3s ease;
    }

    .product-card:hover {
      transform: translateY(-5px);
      border-color: rgba(200, 170, 110, 0.3);
    }

    .product-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 4px;
      margin-bottom: 15px;
    }

    .product-name {
      font-size: 20px;
      color: #C8AA6E;
      margin-bottom: 10px;
    }

    .product-price {
      font-size: 18px;
      font-weight: 700;
      color: #F5F5F5;
      margin-bottom: 10px;
    }

    .product-description {
      font-size: 14px;
      color: rgba(245, 245, 245, 0.7);
      margin-bottom: 15px;
    }

    .product-meta {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: rgba(245, 245, 245, 0.5);
    }

    .in-stock {
      color: #4CAF50;
    }

    .out-stock {
      color: #FF5252;
    }

    .footer {
      text-align: center;
      margin-top: 80px;
      padding-top: 40px;
      border-top: 1px solid rgba(200, 170, 110, 0.3);
      color: rgba(245, 245, 245, 0.5);
    }

    @media print {
      .product-card {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">ORIGEN SIERRA NEVADA</h1>
      <p class="subtitle">Catálogo de Café Premium • ${new Date().getFullYear()}</p>
    </div>

    ${productCards}

    <div class="footer">
      <p>Sierra Nevada de Santa Marta • Colombia</p>
      <p>Email: cafemalusm@gmail.com | WhatsApp: +57 300 123 4567</p>
      <p>https://origen2025.share.zrok.io</p>
    </div>
  </div>
</body>
</html>
  `
}
