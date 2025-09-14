import Block from "../../utils/Block";
import template from "./button.hbs";
import "./button.scss";
import type { ComponentProps } from "../../utils/types";

export default class Button extends Block {
    constructor(props: ComponentProps) {
        super("button", {
            disabled: false, 
            ...props
        });
    }

    render() {
        return super.compile(template.toString(), this.props)
    }
}
