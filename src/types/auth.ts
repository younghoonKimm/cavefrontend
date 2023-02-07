interface User {
  name: string;
  email: string;
  profileImg?: string;
}

export type IUser = User | null;
