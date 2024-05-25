import { Db, MongoClient } from 'mongodb';

export class RepositoryProvider {

  private static instance: RepositoryProvider;
  private db: Db;

  private constructor() {
    RepositoryProvider.instance = this;

    if (!process.env.MONGODB_URL || !process.env.MONGODB_DATABASE) {
      throw new Error('MongoDB variables not found.');
    }

    const client = new MongoClient(process.env.MONGODB_URL);
    this.db = client.db(process.env.MONGODB_DATABASE);
  }

  public static getInstance() {
    if (!RepositoryProvider.instance) {
      new RepositoryProvider();
    }

    return RepositoryProvider.instance;
  }

  public getDB() {
    return this.db;
  }

}