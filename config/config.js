export const config = {
  development: {
    config_id: "development",
    node_port: 8000,
    db_url: "mongodb://0.0.0.0:27017/chatbot",
    secret: "chatbot",
  },
  production: {
    jwtSession: {
      session: false,
    },
    config_id: "production",
    node_port: 8000,
    db_url: "mongodb://0.0.0.0:27017/chatbot",
    secret: "chatbot",
  },
};
