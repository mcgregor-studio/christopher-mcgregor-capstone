export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://gallerai-server.herokuapp.com"
    : "http://localhost:3100";
