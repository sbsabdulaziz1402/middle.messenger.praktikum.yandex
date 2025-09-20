import EventBus from "./eventBus";
import Handlebars from "handlebars";
import type { UserData } from "./types";
export type Props = Record<string, unknown>;

interface BlockEvents {
  [key: string]: unknown[];
  init: [];
  "flow:component-did-mount": [];
  "flow:component-did-update": [Props, Props];
  "flow:render": [];
}

export default class Block<P extends Props = {}> {
  static EVENTS: { [K in keyof BlockEvents]: K } = {
    init: "init",
    "flow:component-did-mount": "flow:component-did-mount",
    "flow:component-did-update": "flow:component-did-update",
    "flow:render": "flow:render",
  };

  protected _element: HTMLElement | null = null;
  protected _meta: { tagName: string; props: P } | null = null;
  public props: P;
  private _eventBus: EventBus<BlockEvents>;
  protected user?: UserData

  constructor(tagName: string = "div", props: P) {
    const eventBus = new EventBus<BlockEvents>();

    this._meta = { tagName, props };
    this.props = this._makePropsProxy(props);
    this._eventBus = eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.init);
    this.getUserData()
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

  dispatchComponentDidMount(): void {
    this._eventBus.emit(Block.EVENTS["flow:component-did-mount"]);
  }

  protected componentDidMount(): void {}

  protected _componentDidUpdate(): void {
    const shouldUpdate = this.componentDidUpdate();
    if (shouldUpdate) {
      this._eventBus.emit(Block.EVENTS["flow:render"]);
    }
  }

  protected componentDidUpdate(): boolean {
    return true;
  }

  public setProps(nextProps: Props): void {
    if (!nextProps) return;
    Object.assign(this.props, nextProps);
  }

  private _render(): void {
    const element = this.render();
    if (this._element && element) {
      this._element.replaceWith(element);
      this._element = element;
      this.addEvents();
    }
  }

  protected get element(): HTMLElement | null {
    return this._element;
  }


  protected render(): HTMLElement {
    this._removeEvents();
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

  getContent(): HTMLElement | null {
    return this.element;
  }

  protected getUserData() {
    const userDataStr = window.localStorage.getItem('userData');
    if (userDataStr) {
      this.user = JSON.parse(userDataStr) as UserData;
      return this.user
    } else {
      return {}
    }
  }

  private _makePropsProxy(props: P): P {
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
    const { events = {} } = this.props as {
      events?: Record<string, EventListener>;
    };
    if (events.blur) {
      const inputEl = this._element?.querySelector("input");
      Object.keys(events).forEach((eventName) => {
        inputEl?.addEventListener(eventName, events[eventName]);
      });
    } else {
      Object.keys(events).forEach((eventName) => {
        this._element?.addEventListener(eventName, events[eventName]);
      });
    }
  }
  public leave() {
    this._element?.remove();
  }

  private _removeEvents() {
    const { events = {} } = this.props as {
      events?: Record<string, EventListener>;
    };

    Object.keys(events).forEach((eventName) => {
      this._element?.removeEventListener(eventName, events[eventName]);
    });
  }
}
