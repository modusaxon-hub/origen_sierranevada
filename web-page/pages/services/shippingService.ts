
/**
 * Shipping Service for Origen Sierra Nevada
 * Handles logic for shipping costs based on location in Colombia.
 * Values are in USD as per the project's current currency setting.
 */

export interface ShippingRate {
    city: string;
    department: string;
    cost: number;
    estimatedDays: string;
}

const SHIPPING_RATES: Record<string, number> = {
    'SANTA MARTA': 0, // Sede principal
    'BARRANQUILLA': 3.50,
    'CARTAGENA': 4.00,
    'BOGOTA': 5.00,
    'MEDELLIN': 5.00,
    'CALI': 5.50,
    'BUCARAMANGA': 5.00,
};

const DEFAULT_RATE = 6.00; // Resto del país

export const shippingService = {
    calculateShipping: (city: string, _department?: string): number => {
        const normalizedCity = city.trim().toUpperCase();
        return SHIPPING_RATES[normalizedCity] ?? DEFAULT_RATE;
    },

    getEstimatedDays: (city: string): string => {
        const normalizedCity = city.trim().toUpperCase();
        if (normalizedCity === 'SANTA MARTA') return '1-2 días';
        if (normalizedCity === 'BOGOTA' || normalizedCity === 'BARRANQUILLA') return '2-3 días';
        return '3-5 días';
    }
};
