
import { supabase } from './supabaseClient';

export interface SiteConfig {
    id: string;
    data: any;
    updated_at: string;
}

export const siteService = {
    getConfig: async (id: string) => {
        const { data, error } = await supabase
            .from('site_configs')
            .select('*')
            .eq('id', id)
            .single();

        return { data: data as SiteConfig | null, error };
    },
    getAllConfigs: async () => {
        const { data, error } = await supabase
            .from('site_configs')
            .select('*');

        return { data: data as SiteConfig[] | null, error };
    }
};
