export interface Message {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: Date;
}

export interface CoffeeMethod {
    title: string;
    time: string;
    texture: string;
    img: string;
    desc: string;
}

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

// AI Service Types
export interface ChatState {
    messages: Message[];
    isLoading: boolean;
}

export interface GenerationState {
    result: string | null; // URL or Base64
    isLoading: boolean;
    error: string | null;
}

export interface VideoGenerationState {
    videoUri: string | null;
    isLoading: boolean;
    statusMessage: string;
    error: string | null;
}

// ========================================
// Authentication & User Types
// ========================================

export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    role: 'user' | 'admin';
    created_at: string;
    updated_at: string;
}

export interface AuthState {
    user: any | null; // Supabase User type
    profile: UserProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignUpData extends LoginCredentials {
    fullName?: string;
}
