import Block from "./Block";
import { ErrorToast } from "./ErrorToast";
import Router from "./Router";
import HTTPTransport from "./FetchAPI";
import type { Props } from "./Block";


export default class Page<P extends Props = {}> extends Block<P> {
  private template: string;
  private context: Record<string, unknown>;
  private components: Record<string, Block> = {};
  protected toast: ErrorToast;
  protected $api = new HTTPTransport();
  private router = new Router('#app');

  
  constructor(template: string, context: Record<string, unknown> = {}) {
    super('main', context as P);
    this.template = template;
    this.context = context;
    this.toast = new ErrorToast();
  }

  protected initComponents(components: Record<string, Block>  = {}) {
    this.components = components;
    if(components) {
        Object.entries(components).forEach(([key, value]) => {
            this.register(key, value)
        })
    }
  }

  register(slotName: string, component: Block) {
    if(slotName) {
        this.components[slotName] = component;
    }
  }

  protected nextLink(link: string) {
    this.router.go(link);
  }

  public mount(): HTMLElement {
    const page = this.compile(this.template, this.context);
    Object.entries(this.components).forEach(([slot, comp]) => {
      const target =
        page.querySelector<HTMLElement>(`[data-slot="${slot}"]`) ||
        page.querySelector<HTMLElement>(`#${slot}`);

      if (!target) {
        return;
      }

      const content = comp.getContent();
      if (content) {
        target.replaceWith(content);
      }

      comp.dispatchComponentDidMount?.();
    });
    this.dispatchComponentDidMount();
    return page;
  }

  showError(message: string) {
    this.toast.show({ message });
  };
}
