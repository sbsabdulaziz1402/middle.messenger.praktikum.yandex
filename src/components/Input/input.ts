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
    };
    
    render() {
        return super.compile(template.toString(), this.props)
    };
}
