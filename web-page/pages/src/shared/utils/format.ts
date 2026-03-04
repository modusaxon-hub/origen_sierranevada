/**
 * Utilitarios de formateo de precios.
 * Moneda base: COP (Pesos Colombianos)
 *
 * IMPORTANTE: Usar Intl.NumberFormat para especificar moneda correctamente
 * - En español: Muestra "$ 18.000" con código COP (no ambiguo con USD)
 * - En inglés: Muestra "USD 4.50" (convertido desde COP)
 */

export const formatPriceCOP = (amount: number): string =>
    new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);

export const formatPriceUSD = (amountCOP: number): string => {
    // Ratio aproximado: 1 USD ≈ 4000 COP
    // NOTA: Verificar tasa de cambio actual y actualizar si es necesario
    const priceUSD = amountCOP / 4000;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(priceUSD);
};
