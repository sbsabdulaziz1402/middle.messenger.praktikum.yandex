import Block from "../../utils/Block";
import template from "./button.hbs";
import "./button.scss";
import Component from "../../utils/types";

export default class Button extends Block {
    constructor(props: Component) {
        super("button", {
            disabled: false, 
            ...props
        })
    }

    render() {
        return super.compile(template.toString(), this.props)
    }
}