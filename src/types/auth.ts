interface User {
  name: string;
  email: string;
  img?: string;
}

export type IUser = User | null;
