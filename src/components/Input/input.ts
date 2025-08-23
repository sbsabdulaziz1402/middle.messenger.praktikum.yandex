import Block from "../../utils/Block";
import template from "./input.hbs";
import "./input.scss";
import InputProps from "../../utils/types";

export default class Input extends Block {
    constructor(props: InputProps) {
        super("div", {
            disabled: false, 
            ...props
        });
        this.addEvents();
    };
    
    render() {
        return super.compile(template.toString(), this.props)
    };
    
    protected addEvents(): void {
        if(!this.element) {
            return
        }
        const inputEl = this.element.querySelector("input");
        Object.entries(this.props.events || {}).forEach(([event, listener]) => {
            inputEl?.addEventListener(event, listener);
        })
    };
}
