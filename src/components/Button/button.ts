import Block from "../../utils/Block";
import template from "./button.hbs";
import "./button.scss";
import Component from "../../utils/types";

export default class Button extends Block {
    constructor(props: Component) {
        super("button", {
            disabled: false, 
            ...props
        });
        this.addEvents();
    }

    render() {
        return super.compile(template.toString(), this.props)
    }

    protected addEvents() {
        if(!this.element) {
            return
        }
        Object.entries(this.props.events || {}).forEach(([event, listener]) => {
            this.element?.addEventListener(event, listener);
        })
    }
}
