export const PRICING_CONFIG = {
    IN: {
        currency: 'INR',
        symbol: '₹',
        plans: {
            monthly: {
                amount: 14900, // ₹149.00 in paisa
                label: '₹149',
                period: '/mo'
            },
            annual: {
                amount: 99900, // ₹999.00 in paisa
                label: '₹999',
                period: '/yr',
                savings: 'Save 44%'
            }
        }
    },
    US: {
        currency: 'USD',
        symbol: '$',
        plans: {
            monthly: {
                link: 'https://buy.polar.sh/checkout/4eae0341-7769-41ac-931d-e4b80f9f469a', // Used by /api/checkout to extract product ID
                label: '$4.99',
                period: '/mo'
            },
            annual: {
                link: 'https://buy.polar.sh/checkout/d0f35be5-5956-4b66-8a87-903e8a320c28', // Used by /api/checkout to extract product ID
                label: '$39',
                period: '/yr',
                savings: 'Save 35%'
            }
        }
    }
};
