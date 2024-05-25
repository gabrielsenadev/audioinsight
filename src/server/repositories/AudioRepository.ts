import { CreateChatAudioInput, GetChatInput } from '../types/dto';
import { Store, getStore } from '@netlify/blobs';

export class AudioRepository {

  private static instance: AudioRepository;
  private store: Store;

  private constructor() {
    AudioRepository.instance = this;

    this.store = getStore({
      name: 'audio',
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_TOKEN,
    });
  }

  public static getInstance() {
    if (!AudioRepository.instance) {
      new AudioRepository();
    }

    return AudioRepository.instance;
  }

  public async createAudio({ id: chatId, audio }: CreateChatAudioInput) {
    return this.store.set(chatId, audio);
  }

  public async getAudio({ id }: GetChatInput) {
    const response = await this.store.get(id, { type: 'blob' });
    
    if (!response) {
      throw new Error('Chat audio not found.');
    }

    return response;
  }

}