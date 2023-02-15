import { useContext } from '@midwayjs/hooks';
import type { Context } from '@midwayjs/koa';

export const signInRequired = async (next: any) => {
  const ctx = useContext<Context>();
  const user = ctx.session.user;

  if (!user) {
    throw ctx.throw(401, 'need login!');
  }

  await next();
};

export const adminRequired = async (next: any) => {
  const ctx = useContext<Context>();
  const user = ctx.session.user;

  console.log('FROM adminRequired', (user?.role ?? 0) <= 10);

  if ((user?.role ?? 0) <= 10) {
    throw ctx.throw(401, 'need admin permission!');
  }

  await next();
};
