import ClientPropagatedError from '../error/ClientPropagatedError';

export default class IQAirClientError extends ClientPropagatedError {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, IQAirClientError.prototype);
  }
}
