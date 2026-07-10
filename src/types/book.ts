export interface Book {
  _id: string;
  title: string;
  author: string;
  category?: string;
  coverImage?: string;
  shortDescription?: string;
  fullDescription?: string;
  language?: string;
  publishedYear?: number | string;
}