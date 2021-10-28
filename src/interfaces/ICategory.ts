export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface ICreateCategoryDTO {
  name: string;
  description: string;
}

export interface IUpdateCategoryDTO {
  name: string;
  description: string;
  featured: boolean;
  menu: boolean;
}
