import { test, type Locator, type Page } from '@playwright/test';

export abstract class PageHolder {
    constructor(protected page: Page) { }

    /**
     * Method returns method casted to generic type of the response
     * @param endpoint Endpoint url(regex)
     * @param btn Button on which user click, to perform Request
     * @returns Serialized Object of class T
     */
    async getResponse<T>(endpoint: string, btn: Locator): Promise<T> {
        return await test.step('Open page', async () => {
            const [response] = await Promise.all([
                this.page.waitForResponse(endpoint, { timeout: 30000 }),
                btn.click(),
            ])
            if (response.ok()) {
                return response.json() as unknown as T;
            } else {
                throw new Error(`Response for endpoint is failed with status: ${response.status()}`);
            }
        })
    }

    async mockDataForEndpoint<T>(endpoint: string, mockData: T): Promise<void> {
        await test.step(`Mock data for endpoint: ${endpoint}`, async () => {
            await this.page.route(endpoint, route => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockData),
                });
            });
        });
    }
}

export abstract class Component extends PageHolder {
    
    abstract expectLoaded(message?: string): Promise<void>;

    async isLoaded(): Promise<boolean> {
        try {
            await this.expectLoaded()
            return true
        } catch {
            return false
        }
    }
}

export abstract class AppPage extends Component {
    /**
     * Path to the page can be relative to the baseUrl defined in playwright.config.ts
     * or absolute (on your own risk)
     */
    public abstract pagePath: string;

    /**
     * Opens the page in the browser and expectLoaded should pass
     */
    async open(path?: string) {
        await this.page.goto(path ?? this.pagePath);
        await this.expectLoaded();
    }
}