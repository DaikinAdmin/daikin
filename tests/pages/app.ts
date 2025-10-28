import { Page } from '@playwright/test';
import { SignUpPage } from './sign-up.page';
import { SignInPage } from './sign-in.page';
import { DashboardPage } from './dashboard.page';
import { ProfilePage } from './profile.page';
import { UsersPage } from './users.page';
import { OrdersPage } from './orders.page';
import { ServicesPage } from './services.page';
import { BenefitsPage } from './benefits.page';
import { SidebarComponent } from './components/sidebar.component';

export class Application {
    public signUp: SignUpPage;
    public signIn: SignInPage;
    public dashboard: DashboardPage;
    public profile: ProfilePage;
    public users: UsersPage;
    public orders: OrdersPage;
    public services: ServicesPage;
    public benefits: BenefitsPage;
    public sidebar: SidebarComponent;

    constructor(page: Page) {
        this.signUp = new SignUpPage(page);
        this.signIn = new SignInPage(page);
        this.dashboard = new DashboardPage(page);
        this.profile = new ProfilePage(page);
        this.users = new UsersPage(page);
        this.orders = new OrdersPage(page);
        this.services = new ServicesPage(page);
        this.benefits = new BenefitsPage(page);
        this.sidebar = new SidebarComponent(page);
    }
}