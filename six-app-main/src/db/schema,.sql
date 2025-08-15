        56-- USERS TABLE
    CREATE TABLE users (
        id UUID PRIMARY KEY,
        phone TEXT,
        name TEXT,
        keyword_summary TEXT[],
        profile_photos TEXT[],
        created_at TIMESTAMP,
        is_connection_cached BOOLEAN,
        connection_cached_at TIMESTAMP
    );

    -- CHATS TABLE
    CREATE TABLE chats (
        chat_id TEXT PRIMARY KEY,
        user1 UUID REFERENCES users(id),
        user2 UUID REFERENCES users(id),
        created_at TIMESTAMP
    );

    -- MESSAGES TABLE
    CREATE TABLE messages (
        id UUID PRIMARY KEY,
        chat_id TEXT REFERENCES chats(chat_id),
        sender_id UUID REFERENCES users(id),
        content TEXT,
        read_by UUID[];
        created_at TIMESTAMP
    );

    -- POSTS TABLE
    CREATE TABLE posts (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        content TEXT,
        category TEXT,
        hide_from_chat BOOLEAN,
        expires_at TIMESTAMP,
        locked BOOLEAN,
        image_url TEXT,
        created_at TIMESTAMP,
        connection_type TEXT
    );

    -- POST REACTIONS TABLE
    CREATE TABLE post_reactions (
        id UUID PRIMARY KEY,
        post_id UUID REFERENCES posts(id),
        reactor_id UUID REFERENCES users(id),
        created_at TIMESTAMP,
        interest BOOLEAN,
        accepted BOOLEAN,
        rejected BOOLEAN,
        post_owner_id UUID REFERENCES users(id)
    );

    -- LOGS TABLE
    CREATE TABLE logs (
        id UUID PRIMARY KEY,
        timestamp TIMESTAMPTZ,
        function_name TEXT,
        message TEXT,
        details TEXT
    );


    CREATE TABLE user_connections (
    user_id UUID,           -- requester
    connection_id UUID,     -- person connected to
    degree INTEGER,         -- 0 / 1 / 2 / 3 etc.
    is_chat BOOLEAN,
    mutuals INTEGER,
    PRIMARY KEY (user_id, connection_id)
    );

    CREATE INDEX idx_user_connections_user_id ON user_connections(user_id);
    CREATE INDEX idx_user_connections_connection_id ON user_connections(connection_id);
    CREATE INDEX idx_user_connections_chat_degree ON user_connections(user_id, degree, is_chat);