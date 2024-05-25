import { Store, getStore } from '@netlify/blobs';
import { CreateChatInput, GetChatInput } from '../types/dto';
import { Chat } from '../types/data';

/**
 * 
 * Criar estrutura de 3 repository => 1. chat, audio e messages
 * Criar estrutura desses 3 repository receberem um database provider, que será uma interface para um provider
 * Criar um database provider, ex: mongodb atlas, onde nele terá as funções de salvar os 3 tipos de repositories e recuperar também.
 */

export class ChatsRepository {

  private static instance: ChatsRepository;
  private store: Store;

  private constructor() {
    ChatsRepository.instance = this;

    this.store = getStore({
      name: 'chats',
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_TOKEN,
      consistency: 'strong',
      fetch: fetch,
    });
  }

  public static getInstance() {
    if (!ChatsRepository.instance) {
      new ChatsRepository();
    }

    return ChatsRepository.instance;
  }

  public async createChat({ content, id, title, vtt }: CreateChatInput) {
    await this.store.setJSON(id, {
      content,
      title,
      vtt,
    });

  }

  public async getChat({ id }: GetChatInput) {
    return await this.store.get(id, { type: 'json' }) as Chat;
  }
}