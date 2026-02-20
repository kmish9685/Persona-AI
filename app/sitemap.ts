import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://persona-ai.com'; // Replace with actual domain if known, or use localhost for now/relative? 
    // Usually sitemaps need full URLs. I will use a placeholder or relative if Next allows, but Next typed sitemap needs string.
    // I'll assume they will deploy to a domain. I'll use a generic one or check if they have a domain config.
    // Checking previous logs... no domain mentioned. I'll use a placeholder 'https://your-domain.com' and add a comment.
    // better: 'https://persona-ai.vercel.app' serves as a good default if Vercel.
    const domain = 'https://persona-ai.vercel.app';

    return [
        {
            url: domain,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${domain}/chat`,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 0.8,
        },

        {
            url: `${domain}/how-it-works`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${domain}/compare/chatgpt`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${domain}/compare/character-ai`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${domain}/compare/claude`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${domain}/compare/perplexity`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${domain}/compare/executive-coaching`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${domain}/guides`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${domain}/guides/inversion-framework`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${domain}/guides/leverage-analysis`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];
}
