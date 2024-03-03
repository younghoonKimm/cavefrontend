export type ICategory = {
  id: string;
  createdAt: string;
  updateAt: string;
  title: string;
  order: number;
};

export type ICategoryInput = {
  title: string;
  order: number;
};
