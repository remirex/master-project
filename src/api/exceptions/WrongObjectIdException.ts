import HttpException from './HttpException';

class WrongObjectIdException extends HttpException {
  constructor(message?: string) {
    super(400, message ? message : 'Id is not valid.');
  }
}

export default WrongObjectIdException;
