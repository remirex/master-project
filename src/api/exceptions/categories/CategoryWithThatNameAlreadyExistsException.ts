import HttpException from '../HttpException';

class CategoryWithThatNameAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(400, `Category with name: ${name} already exists`);
  }
}

export default CategoryWithThatNameAlreadyExistsException;
