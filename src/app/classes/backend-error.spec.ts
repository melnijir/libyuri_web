import { BackendError } from './backend-error';

describe('BackendError', () => {
  it('should create an instance', () => {
    expect(new BackendError()).toBeTruthy();
  });
});
