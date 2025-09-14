import Block from "../../utils/Block";
import ChatItem from "../ChatItem/chatItem";
import "./style.scss";
import type { ChatData } from "../../utils/types";

interface ChatListsProps {
  chats: ChatData[];
  onChatClick: (id: number) => void;
  chatItems?: Block[];
  [key: string]: unknown;
}

export default class ChatList extends Block<ChatListsProps> {
  constructor(props: ChatListsProps) {
    const chatItems : Block[]  = props.chats.map((chat) => {
      return new ChatItem({
        ...chat,
        onClick: () => props.onChatClick(chat.id),
      });
    });


    super("div", {
      ...props,
      chatItems,
    });
  }

  setProps(nextProps: { chats: ChatData[] }) {
    const chatItems : Block[] = nextProps.chats.map(
      (chat) => new ChatItem({
        ...chat, 
        onClick: () => this.props.onChatClick(chat.id),
      })
    );

    super.setProps({
      ...this.props,
      chatItems,
    });
  }

  render() {
    const props = this.props as unknown as ChatListsProps;
    const chatItems = props.chatItems ?? [];
    const template = `
    <div>
        <ul class="chat-list">
        {{#each chatItems}}
            <div data-id="chat-{{this.props.id}}"></div>
          {{/each}}
        </ul>
    </div>`
    const element = this.compile(template, this.props);
    chatItems.forEach((item)=>{
      const id = (item.props as ChatData).id;
      const placeholder = element.querySelector(`[data-id="chat-${id}"]`);
      if (placeholder) {
        placeholder.replaceWith(item.getContent()!)
      }
    })
    return element
  }
}
