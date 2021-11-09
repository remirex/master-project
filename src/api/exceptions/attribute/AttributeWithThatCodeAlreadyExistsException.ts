import HttpException from '../HttpException';

class AttributeWithThatCodeAlreadyExistsException extends HttpException {
  constructor(name: string) {
    super(400, `Attribute with code: ${name} already exists`);
  }
}

export default AttributeWithThatCodeAlreadyExistsException;
