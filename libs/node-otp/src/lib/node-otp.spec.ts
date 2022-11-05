import { nodeOtp } from './node-otp';

describe('nodeOtp', () => {
  it('should work', () => {
    expect(nodeOtp()).toEqual('node-otp');
  });
});
