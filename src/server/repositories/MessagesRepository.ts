import { AddChatMessageInput, GetChatInput } from '../types/dto';
import { RepositoryProvider } from '.';
import { Collection } from 'mongodb';

type MessageDocument = {
  chatId: string;
  content: string;
  role: string;
  createdAt: Date;
}

export class MessagesRepository {

  private static instance: MessagesRepository;
  private collection: Collection<MessageDocument>;

  private constructor() {
    MessagesRepository.instance = this;

    this.collection = RepositoryProvider.getInstance().getDB().collection<MessageDocument>('messages');
  }

  public static getInstance() {
    if (!MessagesRepository.instance) {
      new MessagesRepository();
    }

    return MessagesRepository.instance;
  }

  public async getChatMessages({ id: chatId }: GetChatInput) {
    const messages = await this.collection.find({
      chatId,
    }).sort({ createdAt: 1 }).map(({ content, role, createdAt })  => ({
      content,
      role,
      createdAt,
    })).toArray();
  
    return messages;
  }

  public async addChatMessage({ chatId, content, role }: AddChatMessageInput) {
    this.collection.insertOne({
      chatId,
      content,
      createdAt: new Date(),
      role,
    });
  }

}