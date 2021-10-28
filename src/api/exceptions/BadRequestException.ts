import HttpException from './HttpException';

class BadRequestException extends HttpException {
  constructor() {
    super(400, 'Bad Request.');
  }
}

export default BadRequestException;
