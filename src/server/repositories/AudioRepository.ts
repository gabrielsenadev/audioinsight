import { Store, getStore } from '@netlify/blobs';
import { CreateChatAudioInput, GetChatInput } from '../types/dto';

export class AudioRepository {

  private static instance: AudioRepository;
  private store: Store;

  private constructor() {
    AudioRepository.instance = this;

    this.store = getStore({
      name: 'audio',
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_TOKEN,
      consistency: 'strong',
      fetch: fetch,
    });
  }

  public static getInstance() {
    if (!AudioRepository.instance) {
      new AudioRepository();
    }

    return AudioRepository.instance;
  }

  public async createAudio({ id, audio }: CreateChatAudioInput) {
    await this.store.set(id, audio);
  }

  public getAudio({ id }: GetChatInput) {
    return this.store.get(id, { type: 'blob' });
  }

}