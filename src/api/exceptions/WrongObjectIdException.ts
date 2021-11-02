import HttpException from './HttpException';

class WrongObjectIdException extends HttpException {
  constructor() {
    super(400, 'Id is not valid.');
  }
}

export default WrongObjectIdException;
