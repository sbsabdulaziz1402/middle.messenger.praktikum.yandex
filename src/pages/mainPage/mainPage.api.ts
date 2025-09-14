import HTTPTransport from "../../utils/FetchAPI";
import type { ChatData } from "../../utils/types";

const $api = new HTTPTransport ();

export const getChatsListApi = async (): Promise<ChatData[]>  => {
    const res = await $api.get<ChatData[]>('https://ya-praktikum.tech/api/v2/chats')
    return res || []
}

export const createChatApi = (title: string) => {
    $api.post<ChatData>('https://ya-praktikum.tech/api/v2/chats', {data: {title}}).then((res) => {
        return res
    })
}

export const getChatToken = async (id: number) : Promise<{ token: string }>  => {
    const res = await $api.post<{token: string}>(`https://ya-praktikum.tech/api/v2/chats/token/${id}`)
    return res
}


export const getChatUsersApi = async (
  chatId: number
): Promise<
  Array<{ id: number; first_name: string; second_name: string; login: string }>
> => {
  const res = await $api.get<any[]>(`https://ya-praktikum.tech/api/v2/chats/${chatId}/users`);
  return res || [];
};

export const removeUserChatApi = async (chatId: number, userId: number) => {
  return $api.delete("https://ya-praktikum.tech/api/v2/chats/users", {
    data: { users: [userId], chatId },
  });
};


export const addUserToChatApi = async (chatId: number, userId: number) => {
  return $api.put("https://ya-praktikum.tech/api/v2/chats/users", {
    data: { users: [userId], chatId },
  });
};


export const searchUserApi = async (login: string) => {
  const res = await $api.post<any[]>("https://ya-praktikum.tech/api/v2/user/search", {
    data: { login },
  });
  return res || [];
};

export const deleteChatApi = async (chatId: number): Promise<void> => {
  await $api.delete("https://ya-praktikum.tech/api/v2/chats", {
    data: { chatId },
  });
};
