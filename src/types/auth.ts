export interface User {
  id: string;
  name: string;
  email: string;
  profileImg: string | null;
  categories: ICategory[] | [] | null;
}

export type IUser = User | null;

export type ICategory = {
  id: string;
  createdAt: string;
  updateAt: string;
  title: string;
  order: number;
};

export type PartialUserType = Partial<User>;
