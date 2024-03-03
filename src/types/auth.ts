import { ICategory } from './category';

export interface User {
  id: string;
  name: string;
  email: string;
  profileImg: string | null;
  categories: ICategory[] | [] | null;
}

export type IUser = User | null;

export type PartialUserType = Partial<User>;
