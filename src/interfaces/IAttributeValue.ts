export interface IAttributeValue {
  id: string;
  value: string;
}

export interface IAttributeValueCreateDTO {
  value: string;
  price?: number;
  attribute: string;
}

export interface IAttributeValueUpdateDTO {
  value: string;
  price?: number;
  attribute: string;
}
