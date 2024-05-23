import { ChatsRepository } from "@/server/repositories/ChatsRepository";
import { v4 as uuidv4 } from 'uuid';
import AIService from "./AIService";
import { CreateChatInput } from "../types/dto/chats-service";
import { MessageRole } from "../types/shared";
import { GenerateTextStreamMessageInput } from "../types/dto/ai-service";

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
    const title = await this.aIService.createTitle(summary);

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

  public async sendMessage(chatId: string, message: string) {
    const chat = await this.chatsRepository.getChat({ id: chatId });
  
    if (!chat) {
      throw new Error('Chat not found');
    }

    const messagesHistory = await this.chatsRepository.getChatMessages({ id: chatId });

    const messages = [
      {
        content: 'You are a virtual assistant and have received content from an audio file that the user has sent. The transcribed content and its VTT (Video Text Tracks) are provided below. Please respond using natural, human-like language, but base your responses solely on the content from the audio.',
        role: 'system',
      },
      {
        content: `Context: ${chat.content}`,
        role: 'system',
      },
      {
        content: `VTT: ${chat.vtt}`,
        role: 'system',
      },
      ...messagesHistory.map(message => ({ role: message.role, content: message.content })),
      {
        content: message,
        role: 'user' as MessageRole,
      }
    ] as GenerateTextStreamMessageInput[];

    await this.chatsRepository.addChatMessage({
      chatId,
      content: message,
      role: 'user',
    });

    const stream = await this.aIService.generateTextStream({ messages });
    if (!stream.body) {
      throw new Error('Could not send message. Sorry.');
    }

    const [userStream, appSream] = stream.body.tee();

    new Promise(async () => {
      const reader = appSream.pipeThrough(new TextDecoderStream()).getReader();

      const message = await new Promise<string>((resolve) => {
        let data = '';
  
        reader.read().then(async function processData({ done, value }) {
          if (done) {
            resolve(data);
            return;
          }
  
          try {
            const parsedData = JSON.parse(value.replace('data: ', ''));
            data += parsedData.response;
          } catch (error) {
  
          }
  
          reader.read().then(processData);
        });
      });

      await this.chatsRepository.addChatMessage({
        chatId,
        content: message,
        role: 'assistant',
      });
    });

    return userStream;
  }
}
