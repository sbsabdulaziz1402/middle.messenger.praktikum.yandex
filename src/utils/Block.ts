// Block.js
import EventBus from "./eventBus";
import Handlebars from "handlebars";
type Props = Record<string, unknown>;

export default class Block {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render"
  };

  protected _element: HTMLElement | null = null;
  protected _meta: {tagName: string; props: Props} | null = null;
  public props: Props;
  private _eventBus: EventBus;

  constructor(tagName: string = "div", props: Props = {}) {
    const eventBus = new EventBus();

    this._meta = { tagName, props };
    this.props = this._makePropsProxy(props);
    this._eventBus = eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  protected _registerEvents(eventBus: EventBus): void {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  protected init():void {
    this._createResources();
    this._eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  protected _createResources(): void {
    if(this._meta) {
      const { tagName } = this._meta;
      this._element = document.createElement(tagName);
    }
  }

  _componentDidMount() {
    this.componentDidMount();
  }

  // Вызывается снаружи
  dispatchComponentDidMount() {
    this._eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  componentDidMount() {}

  protected _componentDidUpdate(...args: unknown[]): void {
    const [oldProps, newProps] = args as [Props, Props]
    const shouldUpdate = this.componentDidUpdate(oldProps, newProps);
    if (shouldUpdate) {
      this._eventBus.emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  protected componentDidUpdate(oldProps: Props, newProps: Props) {
    return true;
  }

  setProps = (nextProps: Props) => {
    if (!nextProps) {
      return;
    }
    Object.assign(this.props, nextProps);
  };

  get element() {
    return this._element;
  }

  _render() {
    const element = this.render();
    if (this._element && element) {
      this._element.replaceWith(element);
      this._element = element;
      this.addEvents();
    }
  }

  render(): HTMLElement {
    const temp = document.createElement("template");
    temp.innerHTML = "";
    return temp.content.firstElementChild as HTMLElement;
  }

  protected compile(template: string, context: Props) {
    const html = Handlebars.compile(template)(context);

    const temp = document.createElement("template");
    temp.innerHTML = html.trim();

    return temp.content.firstElementChild as HTMLElement;
  }

  getContent() {
    return this.element;
  }

  _makePropsProxy(props: Props) {
    const self = this;

    return new Proxy(props, {
      get(target, prop) {
        const value = target[prop as keyof typeof target];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target, prop, value) {
        const oldProps = { ...target };
        target[prop as keyof typeof target] = value;
        self._eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, target);
        return true;
      },
      deleteProperty(target, prop) {
        if (typeof prop === "string" && prop.startsWith("_")) {
          throw new Error("нет доступа");
        }
        delete target[prop as keyof typeof target];
        self._eventBus.emit(Block.EVENTS.FLOW_CDU, target, target);
        return true;
      }
    });
  }

  protected addEvents(): void {

  }
}
