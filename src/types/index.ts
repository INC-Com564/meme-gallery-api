export interface User {
  id?: number;
  username: string;
  password: string; // hashed
  role?: "regular" | "admin";
}

export interface Meme {
  id?: number;
  title: string;
  url: string;
  userId?: number;
}

export interface Like {
  id?: number;
  userId: number;
  memeId: number;
}