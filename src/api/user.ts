import {
  Api,
  Get,
  Middleware,
  Post,
  useContext,
  Validate,
} from '@midwayjs/hooks';
import type { Context } from '@midwayjs/koa';
import { z } from 'zod';
import { prisma } from './prisma';
import { USER_SELECT_FIELDS } from './select';
import { adminRequired } from '../middleware/permission';

export const getUsers = Api(
  Get('/api/users'),
  Middleware(adminRequired),
  async () => {
    return prisma.user.findMany({
      select: USER_SELECT_FIELDS,
    });
  }
);

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
      // throw ctx.throw(400, 'incorrect password');
      return false;
    }

    // save session
    const sharedUser = {
      id: result.id,
      name: result.name,
      role: result.role,
    };
    ctx.session.user = sharedUser;
    // ctx.cookies.set('user', JSON.stringify(sharedUser));

    return true;
  }
);

export const signOut = Api(Post('/api/users/signout'), async () => {
  const ctx = useContext<Context>();
  ctx.session = null;
  // ctx.cookies.set('user', null);
  return true;
});
