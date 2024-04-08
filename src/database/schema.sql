DROP TABLE IF EXISTS chats;
CREATE TABLE IF NOT EXISTS chats (
    id VARCHAR(32) PRIMARY KEY,
    context TEXT NOT NULL,
    summary TEXT  NOT NULL
);
DROP TABLE IF EXISTS chat_messages;
CREATE TABLE IF NOT EXISTS chat_messages (
    chat_id VARCHAR(32) NOT NULL,
    role VARCHAR(16) not null,
    message TEXT NOT NULL,
    FOREIGN KEY (chat_id) REFERENCES chats(id)
);
