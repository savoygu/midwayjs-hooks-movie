import { useContext } from '@midwayjs/hooks';
import type { Context } from '@midwayjs/koa';

export function useParamsId() {
  const ctx = useContext<Context>();
  return Number(ctx.params.id);
}
