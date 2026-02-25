import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Planova',
        short_name: 'Planova',
        description: 'A productivity app to manage your plans and actions.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#8b5cf6',
        icons: [
            {
                src: '/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
