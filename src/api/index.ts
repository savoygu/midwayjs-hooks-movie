import {
  Api,
  Get,
  Params,
  Query,
  ValidateHttp,
  useContext,
} from '@midwayjs/hooks';
import type { Context } from '@midwayjs/koa';
import { z } from 'zod';
import { useParams } from './context';
import { prisma } from './prisma';

const IdSchema = z.object({
  id: z.string().regex(/^\d+|all$/),
});

export type Id = z.infer<typeof IdSchema>;

export const getCategoriesMovies = Api(
  Get('/api/categories/:id/movies'),
  Params<Id>(),
  ValidateHttp({ params: IdSchema }),
  async () => {
    const { id } = useParams();
    return await prisma.category.findMany({
      where: id === 'all' ? {} : { id: Number(id) },
      select: {
        id: true,
        name: true,
        movies: {
          take: 20,
        },
      },
    });
  }
);

const SearchSchema = z.object({
  cid: z.string().regex(/^\d+$/).optional(),
  page: z.string().regex(/^\d+$/).optional(),
  size: z.string().regex(/^\d+$/).optional(),
  q: z.string(), // 查询字符串
});

type Search = z.infer<typeof SearchSchema>;

export const getSearchMovies = Api(
  Get('/api/search/movies'),
  Query<Search>(),
  ValidateHttp({ query: SearchSchema }),
  async () => {
    const ctx = useContext<Context>();
    console.log('FROM getSearchedMovies', ctx.query);
    const { cid, page, q } = ctx.query;
    const size = ctx.query.size ?? 10;

    if (cid) {
      const { name, movies, _count } = await prisma.category.findUnique({
        where: { id: Number(cid) },
        select: {
          name: true,
          movies: page // 如果存在 page 则分页，否则获取所有
            ? {
                skip: (Number(page) - 1) * Number(size),
                take: Number(size),
              }
            : true,
          _count: {
            select: {
              movies: true,
            },
          },
        },
      });
      return {
        name,
        movies,
        total: _count.movies, // 总条数
      };
    } else {
      const movies = await prisma.movie.findMany({
        where: {
          title: {
            contains: String(q),
          },
        },
        ...(page
          ? {
              skip: (Number(page) - 1) * Number(size),
              take: Number(size),
            }
          : {}),
      });
      return {
        name: q,
        movies,
        total: movies.length,
      };
    }
  }
);
