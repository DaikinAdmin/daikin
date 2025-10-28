/**
 * Test Data Factory
 * Generates test data for E2E tests
 */

export class TestDataFactory {
    /**
     * Generate unique email
     */
    static generateEmail(prefix: string = 'test'): string {
        return `${prefix}-${Date.now()}@lawhub.pl`;
    }

    /**
     * Generate unique order ID
     */
    static generateOrderId(prefix: string = 'ORD'): string {
        return `${prefix}-${Date.now()}`;
    }

    /**
     * Generate user data
     */
    static generateUserData() {
        const timestamp = Date.now();
        return {
            name: `Test User ${timestamp}`,
            email: this.generateEmail('user'),
            password: 'Qazwsx12@',
            phoneNumber: `+48${Math.floor(100000000 + Math.random() * 900000000)}`,
            street: `Test Street ${Math.floor(Math.random() * 1000)}`,
            apartmentNumber: `${Math.floor(Math.random() * 100)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
            city: ['Warsaw', 'Krakow', 'Gdansk', 'Poznan', 'Wroclaw'][Math.floor(Math.random() * 5)],
            postalCode: `${Math.floor(10 + Math.random() * 90)}-${Math.floor(100 + Math.random() * 900)}`,
            dateOfBirth: '1990-01-15'
        };
    }

    /**
     * Generate order data
     */
    static generateOrderData(customerEmail: string) {
        return {
            orderId: this.generateOrderId(),
            customerEmail,
            dateOfPurchase: new Date().toISOString().split('T')[0],
            nextDateOfService: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            totalPrice: (Math.random() * 5000 + 2000).toFixed(2)
        };
    }

    /**
     * Generate product data
     */
    static generateProductData(index: number = 1) {
        const products = [
            { name: 'Emura FTXJ-MW', basePrice: 2999.99 },
            { name: 'Stylish FTXA-AW', basePrice: 2500.00 },
            { name: 'Perfera FTXM-R', basePrice: 3200.00 },
            { name: 'Comfora FTXP-M', basePrice: 2100.00 },
            { name: 'Sensira FTXC-C', basePrice: 1800.00 }
        ];
        
        const product = products[index % products.length];
        const power = [2.5, 3.0, 3.5, 4.0, 5.0][Math.floor(Math.random() * 5)];
        
        return {
            productId: `DAIKIN-${product.name.split(' ')[0].toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
            description: `Daikin ${product.name} Wall Mounted Air Conditioner ${power}kW`,
            price: (product.basePrice + Math.random() * 500).toFixed(2),
            quantity: '1',
            warranty: `${[3, 5, 7, 10][Math.floor(Math.random() * 4)]} years`
        };
    }

    /**
     * Generate service data
     */
    static generateServiceData() {
        const futureDate = new Date(Date.now() + Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000);
        return {
            dateOfService: futureDate.toISOString().split('T')[0],
            serviceDetails: [
                'Regular maintenance and cleaning',
                'Filter replacement and system check',
                'Refrigerant level check and top-up',
                'Electrical connections inspection',
                'Annual preventive maintenance'
            ][Math.floor(Math.random() * 5)]
        };
    }

    /**
     * Generate benefit data
     */
    static generateBenefitData() {
        const timestamp = Date.now();
        const benefits = [
            { title: 'Free Service Check', description: 'Get a free service check for your Daikin unit', coins: 100 },
            { title: 'Priority Support', description: 'Get priority customer support for 1 year', coins: 200 },
            { title: 'Extended Warranty', description: 'Extend your warranty by 1 year', coins: 300 },
            { title: '10% Discount Voucher', description: '10% discount on your next purchase', coins: 50 },
            { title: 'Filter Replacement', description: 'Free filter replacement for your unit', coins: 75 }
        ];
        
        const benefit = benefits[Math.floor(Math.random() * benefits.length)];
        
        return {
            title: `${benefit.title} ${timestamp}`,
            description: benefit.description,
            daikinCoins: benefit.coins
        };
    }

    /**
     * Generate address data
     */
    static generateAddressData() {
        return {
            street: `Test Street ${Math.floor(Math.random() * 1000)}`,
            apartmentNumber: `${Math.floor(Math.random() * 100)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
            city: ['Warsaw', 'Krakow', 'Gdansk', 'Poznan', 'Wroclaw', 'Lodz', 'Szczecin'][Math.floor(Math.random() * 7)],
            postalCode: `${Math.floor(10 + Math.random() * 90)}-${Math.floor(100 + Math.random() * 900)}`
        };
    }

    /**
     * Generate phone number
     */
    static generatePhoneNumber(): string {
        return `+48${Math.floor(100000000 + Math.random() * 900000000)}`;
    }

    /**
     * Generate future date (for service scheduling)
     */
    static generateFutureDate(daysFromNow: number = 30): string {
        const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
        return date.toISOString().split('T')[0];
    }

    /**
     * Generate past date
     */
    static generatePastDate(daysAgo: number = 30): string {
        const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        return date.toISOString().split('T')[0];
    }
}
