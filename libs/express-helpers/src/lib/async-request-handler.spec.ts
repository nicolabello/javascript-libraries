import { asyncRequestHandler } from './async-request-handler';

describe('asyncRequestHandler', () => {
  it('forwards rejections to next', async () => {
    const error = new Error('boom');
    const next = jest.fn();
    await asyncRequestHandler(async () => {
      throw error;
    })({} as any, {} as any, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('does not call next when the handler resolves', async () => {
    const next = jest.fn();
    const send = jest.fn();
    await asyncRequestHandler(async (req, res) => {
      res.send('ok');
    })({} as any, { send } as any, next);
    expect(send).toHaveBeenCalledWith('ok');
    expect(next).not.toHaveBeenCalled();
  });
});
