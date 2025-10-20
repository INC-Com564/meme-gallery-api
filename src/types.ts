export interface Meme {
  id: number;
  title: string;
  url: string;
  userId: number;
}

export enum Category {
  Funny = "Funny",
  Political = "Political",
  Other = "Other",
}