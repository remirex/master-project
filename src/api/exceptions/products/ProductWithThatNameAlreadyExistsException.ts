import HttpException from '../HttpException';

class ProductWithThatNameAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(400, `Product with name: ${name} already exists`);
  }
}

export default ProductWithThatNameAlreadyExistsException;
