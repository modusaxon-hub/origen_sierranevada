/**
 * Utilitarios de formateo de precios.
 * Lógica centralizada — antes duplicada en LanguageContext.tsx.
 */
export const formatPriceCOP = (amount: number): string =>
    `$${amount.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

export const formatPriceUSD = (amountCOP: number): string => {
    const usd = amountCOP / 4000;
    return `USD ${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
