
import { User } from '@supabase/supabase-js';

export type UserRole = 'Administrador' | 'Usuario' | 'Colaborador' | 'Proveedor';
export type UserStatus = 'active' | 'banned' | 'suspended' | 'pending' | 'deleted';
export type SecurityFlag = 'fraude' | 'estafa' | 'extorsion' | 'uso_indebido' | 'prueba' | 'inactividad' | 'eliminacion' | 'n/a';
export type LanguageCode = 'es' | 'en';

export interface Profile {
    id: string;
    email: string;
    full_name?: string;
    role_name: UserRole;
    status: UserStatus;
    security_flag?: SecurityFlag;
    security_notes?: string;
    phone?: string;
    created_at: string;
    updated_at?: string;
}

export interface AuthState {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    isAdmin: boolean;
}

export type Multilingual = Record<LanguageCode, string>;
export type MultilingualTags = Record<LanguageCode, string[]>;

// Categorías personalizadas del proyecto
export type ProductCategory = 'cafetal' | 'accesorios' | 'antojitos';

export interface ProductVariant {
    id: string;
    name: string; // e.g. "250g", "500g", "1kg" or "Small", "Large"
    price: number;
    stock: number;
}

// Campos intrínsecos de personalidad del producto
export interface ProductPersonality {
    character?: Multilingual;      // Carácter del producto (ej: "Audaz y directo", "Suave y contemplativo")
    personality?: Multilingual;    // Personalidad (ej: "Aventurero", "Reflexivo", "Elegante")
    mood?: Multilingual;           // Estado de ánimo que evoca (ej: "Energizante", "Relajante")
    archetype?: Multilingual;      // Arquetipo asociado (ej: "El Explorador", "El Sabio")
    grind_options?: string[];      // Opciones de molienda disponibles (ej: ["En Grano", "Molido Medio"])
}

export interface Product {
    id: string;
    category: ProductCategory;
    name: Multilingual;
    price: number; // Base price in COP (Colombian Pesos)
    image_url: string;
    stock: number; // General stock or aggregate
    description: Multilingual;
    story: Multilingual;
    tags: MultilingualTags;
    badge?: Multilingual;
    score?: number;
    color: string;
    mask_type: 'pop' | 'static';
    overlay_url?: string;
    variants?: ProductVariant[];
    created_at?: string;
    weight: number; // Peso en gramos
    origin: string; // Origen del café
    available: boolean; // Disponible para venta

    // Campos de personalidad y carácter
    intrinsics?: ProductPersonality;
}

export interface ProductInput {
    category: 'coffee' | 'accessories' | 'derivatives';
    name: Multilingual;
    price: number;
    image_url: string;
    stock: number;
    description: Multilingual;
    story: Multilingual;
    tags: MultilingualTags;
    badge?: Multilingual;
    score?: number;
    color: string;
    mask_type: 'pop' | 'static';
    overlay_url?: string;
    variants?: ProductVariant[];
}

// Subscription related types
export interface FlavorProfile {
    id: string;
    title: string;
    desc: string;
    icon: string;
}

export interface CoffeeFormat {
    id: string;
    title: string;
    desc: string;
    img: string;
}

// Brewing Guide types
export interface CoffeeMethod {
    title: string;
    time: string;
    texture: string;
    img: string;
    desc: string;
}

// AI Lab types
export interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: Date;
}

export interface GenerationState {
    isLoading: boolean;
    resultUri: string | null;
    error: string | null;
}

export interface VideoGenerationState {
    isLoading: boolean;
    videoUri: string | null;
    statusMessage: string;
    error: string | null;
}
