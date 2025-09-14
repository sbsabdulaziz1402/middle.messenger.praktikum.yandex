import Block from "../utils/Block";

type BlockClass = new (tagName?: string, props?: any) => Block;
interface IRouteOptions {
    rootQuery: string;
}

class Route {
    private _pathname: string;
    private _blockClass: BlockClass;
    private _block: any | null = null;
    private _rootQuery: string;

    constructor(pathname: string, view: BlockClass, options: IRouteOptions) {
        this._pathname = pathname;
        this._blockClass = view;
        this._rootQuery = options.rootQuery;
    }

    public navigate(pathname: string): void {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }

    public leave(): void {
        if (this._block) {
            this._block.leave();
        }
    }

    public match(pathname: string): boolean {
        return this._pathname === pathname;
    }

    public render(): void {
        if (!this._block) {
            this._block = new this._blockClass();
            this._block.init();
        }
        const root = document.querySelector(this._rootQuery);
        if (!root) {
            throw new Error(`Root not found: ${this._rootQuery}`);
        }
        root.innerHTML = "";
        root.appendChild(this._block.mount());
    }
}


export default class Router {
    private static __instance: Router;
    private routes: Route[] = [];
    private history = window.history;
    private _currentRoute: Route | null = null;
    private _rootQuery: string = '';

    constructor(rootQuery: string) {
        if (Router.__instance) {
            return Router.__instance;
        }

        this._rootQuery = rootQuery;
        Router.__instance = this;
    }

    public use(pathname: string, block: BlockClass): this {

        const route = new Route(pathname, block, { rootQuery: this._rootQuery });
        this.routes.push(route);
        return this;
    }

    public start(): void {
        window.addEventListener('popstate', () => {
            this._onRoute(window.location.pathname);
        });
        this._onRoute(window.location.pathname);
    }

    private isAuthenticated(): boolean {
        return Boolean(localStorage.getItem("userData"));
    }

    private _onRoute(pathname: string): void {
        const route = this.getRoute(pathname);
        const authRoutes = ["/", "/sign-up"];
        if(authRoutes.includes(pathname) && this.isAuthenticated()) {
          this.go("/messenger");
          return;
        }
        if (!route) {
            return;
        }

        if (this._currentRoute && this._currentRoute !== route) {
            this._currentRoute.leave();
        }

        this._currentRoute = route;
        route.render();
    }

    public go(pathname: string): void {
        const privateRoutes = ["/messenger", "/profile", "/settings"];
        const authRoutes = ["/", "/sign-up"];
        if(privateRoutes.includes(pathname) && !this.isAuthenticated()) {
          this.go("/");
          return;
        } else if(authRoutes.includes(pathname) && this.isAuthenticated()) {

          this.go("/messenger");
          return;
        }
        this.history.pushState({}, '', pathname);
        this._onRoute(pathname);
    }

    public back(): void {
        this.history.back();
    }

    public forward(): void {
        this.history.forward();
    }

    private getRoute(pathname: string): Route | undefined {
        return this.routes.find(route => route.match(pathname));
    }
}
