import Block from "../../utils/Block";
import { ChatHeaderProps } from "../../utils/types";
import template from './template.hbs';
import './style.scss';

export class ChatHeader extends Block<ChatHeaderProps> {
    private outsideClickHandler: ((e: Event) => void) | null = null
    constructor(props: ChatHeaderProps) {
        const handleClick = (e: Event) => {
            const root = e.currentTarget as HTMLElement;
            const target = e.target as HTMLElement;
            const btn = root.querySelector("#chatSettingsBtn") as HTMLElement | null;
            const dropdown = root.querySelector("#chatSettingDropdown") as HTMLElement | null;
            if (!btn || !dropdown) {
                return;
            } 

            if (btn.contains(target)) {
              dropdown.classList.toggle("hidden");
              return;
            }
            const actionEl = target.closest("[data-action]") as HTMLElement | null;
            if (actionEl && dropdown.contains(actionEl)) {
              const action = actionEl.dataset.action;
              if (action && props.onSelectSetting) {
                props.onSelectSetting(action);
              }
              dropdown.classList.add("hidden");
              return;
            }
        };
        super('header', {...props, events: { click: handleClick }})
    }

    protected render(): HTMLElement {
        return this.compile(template.toString(), this.props)
    }

    public componentDidMount(): void {
      this.outsideClickHandler = (e: Event) => {
        const root = this.getContent();
        if (!root) return;
        const dropdown = root.querySelector(
          "#chatSettingDropdown"
        ) as HTMLElement | null;
        if (!dropdown) return;
        if (dropdown.classList.contains("hidden")) return;

        const target = e.target as Node;
        if (!root.contains(target)) {
          dropdown.classList.add("hidden");
        }
      };
      document.addEventListener("click", this.outsideClickHandler);
    }
}

