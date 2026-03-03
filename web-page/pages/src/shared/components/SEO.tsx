
import React, { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    ogType?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    ogImage = 'https://origen2025.share.zrok.io/og-image.jpg',
    ogType = 'website'
}) => {
    const siteName = 'Origen Sierra Nevada';
    const fullTitle = title ? `${title} | ${siteName}` : siteName;

    useEffect(() => {
        document.title = fullTitle;

        const updateMeta = (name: string, content: string, isProperty = false) => {
            let element = document.querySelector(isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                if (isProperty) element.setAttribute('property', name);
                else element.setAttribute('name', name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        if (description) {
            updateMeta('description', description);
            updateMeta('og:description', description, true);
        }

        if (keywords) {
            updateMeta('keywords', keywords);
        }

        updateMeta('og:title', fullTitle, true);
        updateMeta('og:image', ogImage, true);
        updateMeta('og:type', ogType, true);
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:title', fullTitle);
        if (description) updateMeta('twitter:description', description);

    }, [fullTitle, description, keywords, ogImage, ogType]);

    return null; // This component doesn't render anything
};

export default SEO;
