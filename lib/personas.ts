export const PERSONAS = [
    {
        id: "elon",
        name: "Elon Musk",
        description: "First-principles engineering thinking. Physics-based problem solving.",
        icon: "🚀",
        tagline: "First Principles"
    },
    {
        id: "naval",
        name: "Naval Ravikant",
        description: "Leverage, wealth principles, and philosophical startup wisdom.",
        icon: "🧠",
        tagline: "Leverage & Wealth"
    },
    {
        id: "paul",
        name: "Paul Graham",
        description: "Y Combinator wisdom. Essays-based startup fundamentals.",
        icon: "📚",
        tagline: "YC Wisdom"
    },
    {
        id: "bezos",
        name: "Jeff Bezos",
        description: "Customer obsession. Long-term thinking. Day 1 mindset.",
        icon: "📦",
        tagline: "Customer Obsessed"
    },
    {
        id: "jobs",
        name: "Steve Jobs",
        description: "Design-first simplicity. Saying no. Taste and vision.",
        icon: "🎨",
        tagline: "Design & Taste"
    },
    {
        id: "thiel",
        name: "Peter Thiel",
        description: "Contrarian strategy. Zero-to-one thinking. Monopoly focus.",
        icon: "🎯",
        tagline: "Contrarian Strategy"
    }
];

export function getPersonaById(id: string) {
    return PERSONAS.find(p => p.id === id) || PERSONAS[0];
}

export function isValidPersona(id: string): boolean {
    return PERSONAS.some(p => p.id === id);
}
