DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chats;
CREATE TABLE IF NOT EXISTS chats (
    id VARCHAR(32) PRIMARY KEY,
    content TEXT NOT NULL,
    vtt TEXT NOT NULL,
    title TEXT  NOT NULL
);
CREATE TABLE IF NOT EXISTS chat_messages (
    chat_id VARCHAR(32) NOT NULL,
    role VARCHAR(16) not null,
    content TEXT NOT NULL,
    FOREIGN KEY (chat_id) REFERENCES chats(id)
);
