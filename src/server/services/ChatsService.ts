import { ChatsRepository } from "@/server/repositories/ChatsRepository";
import { v4 as uuidv4 } from 'uuid';
import AIService from "./AIService";

type CreateChatInput = {
  audio: Blob;
}

export class ChatsService {
  private static instance: ChatsService;
  private chatsRepository: ChatsRepository;
  private aIService: AIService;

  private constructor() {
    this.chatsRepository = ChatsRepository.getInstance();
    this.aIService = AIService.getInstance();
  }

  public static getInstance() {
    if (!ChatsService.instance) {
      ChatsService.instance = new ChatsService();
    }

    return ChatsService.instance;
  }

  async createChat({ audio }: CreateChatInput) {
    const id = uuidv4().substring(0, 16);
    const { content, vtt } = await this.aIService.convertAudioToText(audio);
    const { content: summary } = await this.aIService.summaryContent(content);
    const title = await this.aIService.createTitle(content);

    await this.chatsRepository.createChat({
      content,
      vtt,
      title,
      audio,
      id,
    });

    await this.chatsRepository.addChatMessage({
      chatId: id,
      content: `Summary: ${summary}`,
      role: 'assistant',
    });

    return id;
  }

  async getChat(id: string) {
    const chat = await this.chatsRepository.getChat({ id });

    if (!chat) {
      throw Error('Chat not found');
    }

    const messages = await this.chatsRepository.getChatMessages({ id });

    return {
      ...chat,
      messages
    };
  }

  public async getChatAudio(id: string) {
    const blob = await this.chatsRepository.getChatAudio({ id });

    if (!blob) {
      throw new Error('Audio not found.');
    }

    return blob;
  }
}
