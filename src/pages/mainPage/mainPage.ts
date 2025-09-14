import Page from "../../utils/Page";
import template from "./mainPage.hbs";
import Button from "../../components/Button/button";
import Input from "../../components/Input/input";
import ChatList from "../../components/ChatList";
import { validateField } from "../../utils/validation";
import { getChatsListApi, createChatApi, getChatToken, removeUserChatApi, getChatUsersApi, deleteChatApi } from "./mainPage.api";
import type { ChatData, ChatUsersModalProps, MessageData } from "../../utils/types";
import { AddChatModal } from "../../components/Modal";
import { ChatSocket } from "../../utils/ChatSocket";
import MessageList from "../../components/MessageList";
import { ChatHeader } from "../../components/ChatHeader";
import { ChatUsersModal } from "../../components/ChatUsersModal";
import { AddChatUserModal } from "../../components/AddChatUser";

export default class MainPage extends Page {
  protected chatsList : ChatData[] = []
  private activeSocket: ChatSocket | null = null;
  private activeChatId: number | null = null;
  private activeChatUsers: ChatUsersModalProps['users'] = [];
  private pageComponents = {
    sendButton: new Button({
      icon: "MdiSend.svg",
      type: "submit",
      className: "message-input-form__button",
      events: {
        click: (e) => {
          e.preventDefault();
          this.getFormData();
        },
      },
    }),

    messageInput: new Input({
      wrapperClassName: "full-wrapper",
      className: "message-input-form__input",
      name: "message",
      id: "message",
      inputType: "text",
    }),

    AddChatComponent: new AddChatModal({
      onSave: async (title: string) => {
        await createChatApi(title)
        this.getChatsList()
      },
      onClose: () => console.log("Закрыли модалку"),
    }),

    addChatButton: new Button({
      label: "новый чат",
      className: "form__button",
      events: {
        click: (e) => {
          e.preventDefault();
          this.openAddChatModal()
        },
      },
    }),

    profileButton: new Button({
      label: "Профиль",
      className:"sidebar__profile-link",
      events: {
        click: ()=>{
          this.nextLink("/profile")
        }
      }
    }),

    chatList: new ChatList({
        chats: [],
        onChatClick: (id) => this.handleChatClick(id)
    }),

    messageList: new MessageList({
      messages: []
    }),

    chatheader: new ChatHeader({
      chatTitle: '',
      onSelectSetting: (type) => this.handleOnChatSettingClick(type)
    }),

    chatUsersModal: new ChatUsersModal({
      onRemoveUser: async (chatId, userId) => {
        await this.removeUserChat(chatId, userId);
        this.pageComponents.chatUsersModal.show(chatId, this.activeChatUsers);
      },
    }),
    addChatUserModal: new AddChatUserModal({
      chatId: this.activeChatId,
      visible: true
    })
  };

  constructor() {
    super(template.toString(), {title: "Основной", messages: [{content: 'asdasd'}], activeChatId: null });
    super.initComponents(this.pageComponents);
  };

  async componentDidMount() {
    this.getChatsList()
  }
  
  getFormData() {
    const form = document.getElementById('chat-message-form') as HTMLFormElement;
    if(form) {
      const formData = new FormData(form);
      const values: Record<string, string> = {};
      formData.forEach((value, key) => {
        values[key] = value.toString();
        const errors = validateField(key, value.toString());
        if (!errors.isValid) {
            this.showError(errors.error);
        } else {
          if (this.activeSocket) {
            this.activeSocket.send({
              content: values.message,
              type: "message"
            });

          }
        }
      });
    }
  };

  async getChatsList() {
    this.chatsList = await getChatsListApi();
    this.pageComponents.chatList.setProps({chats: this.chatsList})
  }

  private openAddChatModal() {
    let componenet = this.pageComponents.AddChatComponent as AddChatModal
    componenet.show();
  }

  private async handleChatClick(id:number) {
    this.activeChatId = id;
    this.pageComponents.chatheader.setProps({chatTitle: this.chatsList.find(el=> el.id == id)?.title})
    const users = await getChatUsersApi(id)
    this.activeChatUsers = users;
    this.setProps({activeChatId: id})
    this.pageComponents.chatList.setProps({chats: this.chatsList.map(chat=>{
      return {
        ...chat,
        isSelected: chat.id === this.activeChatId
      }
    })})

    const tokenRes = getChatToken(id)
    const { token } = await tokenRes
    if (this.activeSocket) {
      this.activeSocket.close();
    }

    this.activeSocket = new ChatSocket(
      id,
      token,
      (data) => {
        let messages: MessageData[] = [];
        if (Array.isArray(data)) {
          messages = data.reverse(); 
          this.pageComponents.messageList.setProps({messages})
        } else if(data.type == 'message') {
          this.pageComponents.messageList.setProps({messages})
        }
        this.setProps({ messages });
      }
    );
    this.activeSocket.connect();
  }

  protected async handleOnChatSettingClick(type: string) {
    if (type === "users") {
      if (this.activeChatId) {
        (this.pageComponents.chatUsersModal as ChatUsersModal).show(
          this.activeChatId, this.activeChatUsers
        );
      }
    } else if (type === "add") {
      if (this.activeChatId) {
        (this.pageComponents.addChatUserModal as AddChatUserModal).show(
          this.activeChatId
        );
      }
      //
    } else if (type === "remove") {
      if (this.activeChatId) {
        await deleteChatApi(this.activeChatId);
        this.activeChatId = null;
        this.getChatsList();
        this.pageComponents.messageList.setProps({messages: []})
        this.pageComponents.chatheader.setProps({chatTitle: ''})
      }
    }
  }

  private async removeUserChat(chatId:number, userId:number) {
    await removeUserChatApi(chatId, userId);
    const users = await getChatUsersApi(chatId);
    this.activeChatUsers = users;
  }
};
