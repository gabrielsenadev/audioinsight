import { CreateChatInput, GetChatInput } from '../types/dto';
import { Collection } from 'mongodb';
import { RepositoryProvider } from '.';

type ChatDocument = {
  id: string;
  title: string;
  content: string;
  vtt: string;
  createdAt: Date;
}

export class ChatsRepository {

  private static instance: ChatsRepository;
  private collection: Collection<ChatDocument>;

  private constructor() {
    ChatsRepository.instance = this;
    this.collection = RepositoryProvider.getInstance().getDB().collection<ChatDocument>('chats');
  }

  public static getInstance() {
    if (!ChatsRepository.instance) {
      new ChatsRepository();
    }

    return ChatsRepository.instance;
  }

  public async createChat({ content, id, title, vtt }: CreateChatInput) {
    const response = await this.collection.insertOne({
      id,
      content,
      title,
      vtt,
      createdAt: new Date(),
    });

    return response.insertedId;
  }

  public async getChat({ id }: GetChatInput) {
    const chat = await this.collection.findOne({
      id,
    });

    if (!chat) {
      throw new Error('Chat not found');
    }

    const { title, vtt, content } = chat;

    return {
      title,
      vtt,
      content
    };
  }
}