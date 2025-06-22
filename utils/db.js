import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const dbName = process.env.DB_DATABASE || 'files_manager';
    const uri = `mongodb://${host}:${port}`;

    this.client = new MongoClient(uri);
    this.dbName = dbName;
    this.isConnected = false;
    this.init();
  }

  async init() {
    try {
      await this.client.connect();
      this.isConnected = true;
      this.db = this.client.db(this.dbName);
      console.log("MongoDB Connection Successful...");
    }
    catch(err) {
      console.error("Unsuccessful MongoDB Connection X");
      this.isConnected = false;
    }
  }

  isAlive() {
    return this.isConnected;
  }

  async nbUsers() {
    try {
      if (!this.isAlive()) return 0;
      console.log("Awaiting count...");
      const count = await this.db.collection('users').countDocuments();
      if (count) {
        console.log("Count: ", count);
        return count;
      }
      else {
        throw new Error("Something went wrong... Couldn't fetch count");
      }
    }
    catch(err) {
      console.error("User count error: ", err);
      return null;
    }
  }

  async nbFiles() {
    try {
      if (!this.isAlive()) return 0;
      console.log("Awaiting count...");
      const count = await this.db.collection('files').countDocuments();
      if (count) {
        console.log("Count: ", count);
        return count;
      }
      else {
        throw new Error("Something went wrong... Couldn't fetch count");
      }
    }
    catch(err) {
      console.error("User count error: ", err);
      return null;
    }
  }
}

const dbClient = new DBClient();
export default dbClient;

