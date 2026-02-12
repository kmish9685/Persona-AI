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
                link: 'https://buy.polar.sh/polar_cl_xxx_monthly', // User to update
                label: '$4.99',
                period: '/mo'
            },
            annual: {
                link: 'https://buy.polar.sh/polar_cl_xxx_annual', // User to update
                label: '$39',
                period: '/yr',
                savings: 'Save 35%'
            }
        }
    }
};
