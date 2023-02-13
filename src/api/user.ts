import {
  Api,
  Get,
  Middleware,
  Post,
  Validate,
  useContext,
} from '@midwayjs/hooks';
import type { Context } from '@midwayjs/koa';
import { z } from 'zod';
import { adminRequired } from '../middleware/permission';
import { prisma } from './prisma';
import { USER_SELECT_FIELDS } from './select';

export const getUsers = Api(
  Get('/api/users'),
  Middleware(adminRequired),
  async () => {
    return prisma.user.findMany({
      select: USER_SELECT_FIELDS,
    });
  }
);

export const checkUserExpires = Api(Get('/api/users/expires'), async () => {
  const ctx = useContext<Context>();
  const user = ctx.session.user;
  return [Boolean(!user), user];
});

const UserSchema = z.object({
  name: z.string().min(1),
  password: z.string().min(6).max(20),
});

export const signUp = Api(
  Post('/api/users/signup'),
  Validate(UserSchema),
  async (user: z.infer<typeof UserSchema>) => {
    return await prisma.user.create({
      data: {
        name: user.name,
        password: user.password,
      },
      select: USER_SELECT_FIELDS,
    });
  }
);

export const signIn = Api(
  Post('/api/users/signin'),
  Validate(UserSchema),
  async (user: z.infer<typeof UserSchema>) => {
    const ctx = useContext<Context>();
    const result = await prisma.user.findUnique({
      where: { name: user.name },
    });

    if (result.password !== user.password) {
      ctx.throw(400, '用户名或密码不正确');
    }

    // save session
    const sharedUser = {
      id: result.id,
      name: result.name,
      role: result.role,
    };
    ctx.session.user = sharedUser;
    ctx.cookies.set('user', JSON.stringify(sharedUser), {
      expires: new Date(Date.now() + 24 * 3600 * 1000),
    });

    return sharedUser;
  }
);

export const signOut = Api(Post('/api/users/signout'), async () => {
  const ctx = useContext<Context>();
  ctx.session = null;
  ctx.cookies.set('user', null);
  return true;
});
