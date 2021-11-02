export interface IBrand {
  id: string;
  name: string;
  slug: string;
  logo: string;
}

export interface IBrandCreateDTO {
  name: string;
}

export interface IBrandUpdateDTO {
  name: string;
}
