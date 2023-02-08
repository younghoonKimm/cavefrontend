interface User {
  name: string;
  email: string;
  profileImg: string | null;
}

export type IUser = User | null;
