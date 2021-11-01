export interface IBrand {
  id: string;
  name: string;
  slug: string;
  brandLogo: string;
}

export interface IBrandCreateDTO {
  name: string;
}

export interface IBrandUpdateDTO {
  name: string;
}
