import Handlebars from "handlebars";
import Block from "./Block"; // твой базовый класс компонента

export default class Page extends Block {
  private template: string;
  private context: Record<string, unknown>;
  private components: Record<string, Block> = {};

  constructor(template: string, context: Record<string, unknown> = {}) {
    super('main')
    this.template = template;
    this.context = context;
  }

  protected initComponents(components: Record<string, Block>  = {}) {
    this.components = components;
    if(components) {
        Object.entries(components).forEach(([key, value]) => {
            this.register(key, value)
        })
    }
  }

  /** Регистрируем компонент под именем слота */
  register(slotName: string, component: Block) {
    if(slotName) {
        this.components[slotName] = component;
    }
  }

  /** Рендерим HBS и монтируем компоненты в слоты */
  mount(rootSelector: string) {
    const root = document.querySelector(rootSelector);
    if (!root) throw new Error(`Root "${rootSelector}" not found`);

    const html = Handlebars.compile(this.template)(this.context);
    root.innerHTML = html;

    Object.entries(this.components).forEach(([slot, comp]) => {
      // можно и по id, и по data-slot
      const target =
        root.querySelector<HTMLElement>(`[data-slot="${slot}"]`) ||
        root.querySelector<HTMLElement>(`#${slot}`);

      if (!target) {
        console.warn(`Slot "${slot}" not found on page`);
        return;
      }

      // вставляем готовый корневой элемент компонента
      const content = comp.getContent()
      if(content){
          target.replaceWith(content);
      }
      // если у Block есть метод для CDM — вызовем
      // @ts-ignore – зависит от твоей реализации Block
      comp.dispatchComponentDidMount?.();
    });
  }
}
