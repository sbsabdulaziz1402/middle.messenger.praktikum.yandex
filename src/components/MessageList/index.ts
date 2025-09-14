import Block from "../../utils/Block";

export interface Message {
  id: number;
  user_id: number;
  content: string;
  time: string;
  isOutgoing?: boolean;
}

interface MessageListProps {
  messages: Message[];
  currentUserId?: number;
  [key: string]: unknown;
}

export default class MessageList extends Block<MessageListProps> {
  constructor(props: MessageListProps) {
    super("div", props);
  }

  convertMessages() {
    const data = this.props.messages.map(el=>{
        return {
            ...el,
            isOutgoing: el.user_id == (this.user ? this.user.id: 0)
        }
    })
    this.setProps({messages: data})
  }

  render() {
    const template = `
      <div class="messenger-page__messages">
        {{#if messages}}
          {{#each messages}}
            {{#if this.isOutgoing}}
              <div class="messenger-page__message-outgoing">{{this.content}}</div>
            {{else}}
              <div class="messenger-page__message-incoming">{{this.content}}</div>
            {{/if}}
          {{/each}}
        {{else}}
          <div class="messenger-page__no-messages">Нет сообщений</div>
        {{/if}}
      </div>`;

    return this.compile(template, this.props);
  }
}
