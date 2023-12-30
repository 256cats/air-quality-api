export default class ClientPropagatedError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, ClientPropagatedError.prototype);
  }
}
