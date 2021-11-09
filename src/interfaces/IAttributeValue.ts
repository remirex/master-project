export interface IAttributeValue {
  id: string;
  value: string;
}

export interface IAttributeValueCreateDTO {
  value: string;
  price: number;
  attribute: string;
}
