
export interface Book {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  genre: string;
  pages: string[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
