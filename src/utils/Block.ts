import EventBus from "./eventBus";
import Handlebars from "handlebars";

type Props = Record<string, unknown>;

interface BlockEvents {
  [key: string]: unknown[];
  init: [];
  "flow:component-did-mount": [];
  "flow:component-did-update": [Props, Props];
  "flow:render": [];
}

export default class Block {
  static EVENTS: { [K in keyof BlockEvents]: K } = {
    init: "init",
    "flow:component-did-mount": "flow:component-did-mount",
    "flow:component-did-update": "flow:component-did-update",
    "flow:render": "flow:render",
  };

  protected _element: HTMLElement | null = null;
  protected _meta: { tagName: string; props: Props } | null = null;
  public props: Props;
  private _eventBus: EventBus<BlockEvents>;

  constructor(tagName: string = "div", props: Props = {}) {
    const eventBus = new EventBus<BlockEvents>();

    this._meta = { tagName, props };
    this.props = this._makePropsProxy(props);
    this._eventBus = eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.init);
  }

  protected _registerEvents(eventBus: EventBus<BlockEvents>): void {
    eventBus.on(Block.EVENTS.init, this.init.bind(this));
    eventBus.on(Block.EVENTS["flow:component-did-mount"], this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS["flow:component-did-update"], this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS["flow:render"], this._render.bind(this));
  }

  protected init(): void {
    this._createResources();
    this._eventBus.emit(Block.EVENTS["flow:render"]);
  }

  protected _createResources(): void {
    if (this._meta) {
      const { tagName } = this._meta;
      this._element = document.createElement(tagName);
    }
  }

  private _componentDidMount(): void {
    this.componentDidMount();
  }

  protected dispatchComponentDidMount(): void {
    this._eventBus.emit(Block.EVENTS["flow:component-did-mount"]);
  }

  protected componentDidMount(): void {}

  protected _componentDidUpdate(oldProps: Props, newProps: Props): void {
    const shouldUpdate = this.componentDidUpdate(oldProps, newProps);
    if (shouldUpdate) {
      this._eventBus.emit(Block.EVENTS["flow:render"]);
    }
  }

  protected componentDidUpdate(oldProps: Props, newProps: Props): boolean {
    return true;
  }

  protected setProps(nextProps: Props): void {
    if (!nextProps) return;
    Object.assign(this.props, nextProps);
  }

  protected get element(): HTMLElement | null {
    return this._element;
  }

  private _render(): void {
    const element = this.render();
    if (this._element && element) {
      this._element.replaceWith(element);
      this._element = element;
      this.addEvents();
    }
  }

  protected render(): HTMLElement {
    const temp = document.createElement("template");
    temp.innerHTML = "";
    return temp.content.firstElementChild as HTMLElement;
  }

  protected compile(template: string, context: Props): HTMLElement {
    const html = Handlebars.compile(template)(context);
    const temp = document.createElement("template");
    temp.innerHTML = html.trim();
    return temp.content.firstElementChild as HTMLElement;
  }

  protected getContent(): HTMLElement | null {
    return this.element;
  }

  private _makePropsProxy(props: Props): Props {
    const self = this;

    return new Proxy(props, {
      get(target, prop) {
        const value = target[prop as keyof typeof target];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target, prop, value) {
        const oldProps = { ...target };
        target[prop as keyof typeof target] = value;
        self._eventBus.emit(Block.EVENTS["flow:component-did-update"], oldProps, target);
        return true;
      },
      deleteProperty(target, prop) {
        if (typeof prop === "string" && prop.startsWith("_")) {
          throw new Error("нет доступа");
        }
        delete target[prop as keyof typeof target];
        self._eventBus.emit(Block.EVENTS["flow:component-did-update"], target, target);
        return true;
      },
    });
  }

  protected addEvents(): void {
    // реализуется в наследниках
  }
}
