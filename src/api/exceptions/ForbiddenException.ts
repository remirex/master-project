import HttpException from './HttpException';

class ForbiddenException extends HttpException {
  constructor() {
    super(403, 'Forbidden.');
  }
}

export default ForbiddenException;
