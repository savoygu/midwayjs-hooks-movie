import { Context } from '@midwayjs/koa';
import { useContext } from '@midwayjs/hooks';

export const logger = async (next: any) => {
  const ctx = useContext<Context>();

  console.log(`<-- [${ctx.method}] ${ctx.url}`);

  const start = Date.now();
  await next();
  const cost = Date.now() - start;

  console.log(`--> [${ctx.method}] ${ctx.url} ${cost}ms`);
};
