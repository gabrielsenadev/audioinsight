import { Store, getStore } from '@netlify/blobs';
import { AddChatMessageInput, CreateChatInput, GetChatInput } from '../types/dto';
import { Chat, ChatMessage } from '../types/data';
import { generateID } from '../utils/generate-id';

export class MessagesRepository {

  private static instance: MessagesRepository;
  private store: Store;

  private constructor() {
    MessagesRepository.instance = this;

    this.store = getStore({
      name: 'messages',
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_TOKEN,
      fetch: fetch,
    });
  }

  public static getInstance() {
    if (!MessagesRepository.instance) {
      new MessagesRepository();
    }

    return MessagesRepository.instance;
  }

  private getChatMessageKey(chatId: string, id: string) {
    return `${chatId}/${id}`;
  }

  private getChatMessageDirectoryKey(chatId: string) {
    return `${chatId}`;
  }

  public async getChatMessages({ id }: GetChatInput) {
    const prefix = this.getChatMessageDirectoryKey(id);

    const messagesList = await this.store.list({
      prefix,
      directories: false,
    });

    const messages = await Promise.all(messagesList.blobs.map(async ({ key }) => {
      const data = await this.store.get(key, { type: 'json' }) as ChatMessage;
      
      return data;
    }));

    messages.sort((mA, mB) => mA.timeStamp > mB.timeStamp ? 1 : -1);
    
    return messages;
  }

  public async addChatMessage({ chatId, content, role }: AddChatMessageInput) {
    const id = generateID();

    await this.store.setJSON(this.getChatMessageKey(chatId, id), {
      content,
      role,
      timeStamp: Date.now(),
    });
  }

}