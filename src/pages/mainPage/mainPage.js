const chats = [
  { name: 'Чат 1' },
  { name: 'Чат 2' },
  { name: 'Чат 3' }
];

const messages = [
  { text: 'Привет!', isOutgoing: false },
  { text: 'Здравствуйте, как дела?', isOutgoing: true },
  { text: 'Всё хорошо, спасибо!', isOutgoing: false },
  { text: 'Отлично!', isOutgoing: true }
];

export const messengerContext = {
  activeChatTitle: 'Чат 1',
  chats,
  messages
};
