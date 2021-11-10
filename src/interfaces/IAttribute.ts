export interface IAttribute {
  id: string;
  name: string;
  code: string;
  frontend_type: string;
}

export interface IAttributeCreateDTO {
  name: string;
  code: string;
  frontend_type: string;
  is_filterable?: boolean;
  is_required?: boolean;
}

export interface IAttributeUpdateDTO {
  name: string;
  code: string;
  frontend_type: string;
  is_filterable?: boolean;
  is_required?: boolean;
}
