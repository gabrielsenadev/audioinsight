import { ChatData, ChatMessageData } from "@/types";

export class DatabaseController {

  private static instance: DatabaseController;

  private constructor() {

  }

  public static getInstance() {
    if (!DatabaseController.instance) {
      DatabaseController.instance = new DatabaseController();
    }

    return DatabaseController.instance;
  }

  public createChat(db: D1Database, {
    id,
    content,
    vtt,
    title
  }: ChatData) {
    return db.prepare(`INSERT INTO chats (id, content, vtt, title) VALUES (?, ?, ?, ?)`).bind(id, content, vtt, title).run();
  }

  private generateAddChatMessageStatement(db: D1Database) {
    return db.prepare(`INSERT INTO chat_messages (chat_id, role, content) VALUES (?, ?, ?)`);;
  }

  public addChatMessages(db: D1Database, messages: ChatMessageData[]) {
    const stmt = this.generateAddChatMessageStatement(db);
    const datas = messages.map(({ chatId, role, content }) => stmt.bind(chatId, role, content));

    return db.batch(datas);
  }

  public addChatMessage(db: D1Database, { chatId, role, content }: ChatMessageData) {
    const stmt = this.generateAddChatMessageStatement(db);

    return stmt.bind(chatId, role, content).run();
  }

  public getChat(db: D1Database, chatId: string) {
    return db.prepare(`SELECT * FROM chats WHERE id=?`).bind(chatId).first<ChatData>();
  }

  private generateChatMessageStatement(db: D1Database, chatId: string) {
    return db.prepare(`SELECT role, content FROM chat_messages WHERE chat_id=?`).bind(chatId);
  }

  public getChatMessages(db: D1Database, chatId: string) {
    return this.generateChatMessageStatement(db, chatId).all<Omit<ChatMessageData, 'chatId'>>();
  }

  public getFirstChatMessage(db: D1Database, chatId: string) {
    return this.generateChatMessageStatement(db, chatId).bind(chatId).first<Omit<ChatMessageData, 'chatId'>>();
  }
}