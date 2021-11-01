import HttpException from '../HttpException';

class BrandWithThatNameAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(400, `Category with name: ${name} already exists`);
  }
}

export default BrandWithThatNameAlreadyExistsException;
