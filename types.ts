// types.ts

export interface Note {
  id?: string;
  content: string | undefined;
  important: boolean;
}

export interface User {
  token: string;
  username?: string;
}

