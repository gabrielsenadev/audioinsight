import { Store, getStore } from '@netlify/blobs';
import { v4 as uuidv4 } from 'uuid';
import { AddChatMessageInput, CreateChatInput, GetChatInput } from '../types/dto';
import { Chat, ChatMessage } from '../types/data';

export class ChatsRepository {

  private static instance: ChatsRepository;
  private store: Store;

  private constructor() {
    ChatsRepository.instance = this;

    this.store = getStore({
      name: 'chats',
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_TOKEN,
    });
  }

  public static getInstance() {
    if (!ChatsRepository.instance) {
      new ChatsRepository();
    }

    return ChatsRepository.instance;
  }

  private getChatAudioKey(id: string) {
    return `${id}/audio`;
  }

  private getChatMessageDirectoryKey(id: string) {
    return `${id}/message/`;
  }

  private getChatMessageKey(chatId: string, id: string) {
    return `${chatId}/message/${id}`;
  }

  public async createChat({ content, id, title, vtt, audio }: CreateChatInput) {

    await this.store.setJSON(id, {
      content,
      title,
      vtt,
    });

    await this.store.set(this.getChatAudioKey(id), audio);
  }

  public async getChat({ id }: GetChatInput) {
    return await this.store.get(id, { type: 'json' }) as Chat;
  }

  public getChatAudio({ id }: GetChatInput) {
    return this.store.get(this.getChatAudioKey(id), { type: 'blob' });
  }

  public async getChatMessages({ id }: GetChatInput) {
    const prefix = this.getChatMessageDirectoryKey(id);

    const messagesList = await this.store.list({
      directories: false,
      prefix,
    });

    const messages = await Promise.all(messagesList.blobs.map(async ({ key }) => {
      const { data, metadata } = await this.store.getWithMetadata(key, { type: 'json' }) as { data: ChatMessage, metadata: { timeStamp: number }};
      
      return {
        ...data,
        ...metadata,
      };
    }));

    messages.sort((mA, mB) => mA.timeStamp > mB.timeStamp ? 1 : -1);
    
    return messages;
  }

  public async addChatMessage({ chatId, content, role }: AddChatMessageInput) {
    const id = uuidv4().substring(0, 16);

    await this.store.setJSON(this.getChatMessageKey(chatId, id), {
      content,
      role,
    }, {
      metadata: {
        timeStamp: Date.now(),
      }
    });
  }

}