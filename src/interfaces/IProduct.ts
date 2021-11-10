export interface IProduct {
  id: string;
  name: string;
  description: string;
}

export interface IProductCreateDTO {
  name: string;
  description: string;
  price: number;
  countInStock: number;
  category: string;
  brand: string;
}
