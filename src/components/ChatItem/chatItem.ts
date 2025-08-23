import Block from "../../utils/Block";
import template from "./chatItem.hbs";
import "./chatItem.scss";
import Component from "../../utils/types";

export default class ChatItem extends Block {
    constructor(props: Component) {
        super("li", {
            disabled: false, 
            ...props
        });
    };

    render() {
        return super.compile(template.toString(), this.props)
    };

    protected addEvents() {
        if(!this.element) {
            return
        }
        Object.entries(this.props.events || {}).forEach(([event, listener]) => {
            this.element?.addEventListener(event, listener);
        })
    };
};
