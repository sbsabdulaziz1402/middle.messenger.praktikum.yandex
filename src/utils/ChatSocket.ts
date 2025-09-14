import type { UserData } from "./types";
import type { MessageData } from "../utils/types";
export class ChatSocket {
  private socket: WebSocket | null = null;
  private user_data: UserData;
  private messageList: MessageData[] = []
  constructor(
    private chatId: number,
    private token: string,
    private onMessage: (data: any) => void
  ) {
    const userDataStr = window.localStorage.getItem('userData');
    if (userDataStr) {
      this.user_data = JSON.parse(userDataStr) as UserData;
    } else {
      throw new Error('User data not found in localStorage');
    }
  }

  connect() {
    this.socket = new WebSocket(
      `wss://ya-praktikum.tech/ws/chats/${this.user_data.id}/${this.chatId}/${this.token}`
    );

    this.socket.addEventListener("open", () => {
      this.send({ content: "0", type: "get old" });
    });

    this.socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (Array.isArray(data)) {
        this.messageList = data;
        this.onMessage(data);
      } else if(data.type == 'message') {
        this.messageList = [...this.messageList, data];
        this.onMessage(this.messageList);
      }
    });

    this.socket.addEventListener("close", () => {
      console.log("❌ WebSocket закрыт");
    });

    this.socket.addEventListener("error", (e) => {
      console.error("Ошибка WebSocket", e);
    });
  }

  send(message: any) {
    this.socket?.send(JSON.stringify(message));
  }

  close() {
    this.socket?.close();
  }
}
