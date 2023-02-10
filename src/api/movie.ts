import {
  Api,
  Delete,
  Get,
  Params,
  Post,
  Put,
  Validate,
  ValidateHttp,
} from '@midwayjs/hooks';
import { z } from 'zod';
import { prisma } from './prisma';
import { Id, IdSchema } from './schema';
import { useParamsId } from './context';
import { COMMENT_SELECT_FIELDS } from './select';

export const getMovie = Api(
  Get('/api/movies/:id'),
  Params<Id>(),
  ValidateHttp({ params: IdSchema }),
  async () => {
    const id = useParamsId();
    return await prisma.movie.findUnique({
      where: { id },
      // include: {
      //   category: true,
      //   comments: {
      //     orderBy: {
      //       createdAt: 'desc',
      //     },
      //     include: {
      //       user: true,
      //     },
      //   },
      // },
      select: {
        title: true,
        summary: true,
        poster: true,
        doctor: true,
        year: true,
        country: true,
        language: true,
        category: {
          select: {
            name: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
          select: COMMENT_SELECT_FIELDS,
        },
      },
    });
  }
);

export const getMovies = Api(Get('/api/movies'), async () => {
  return await prisma.movie.findMany();
});

const MovieSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  poster: z.string().url(),
  doctor: z.string().min(1),
  year: z.number(),
  country: z.string().min(1),
  language: z.string().min(1),
  flash: z.string().url().optional(),
});

const FullMovieSchema = MovieSchema.merge(
  z.object({
    id: z.number(),
    categoryId: z.number().optional(),
  })
);

export const updateMovie = Api(
  Put('/api/movies'),
  Validate(FullMovieSchema),
  async (movie: z.infer<typeof FullMovieSchema>) => {
    return await prisma.movie.update({
      where: { id: movie.id },
      data: {
        title: movie.title,
        summary: movie.summary,
        poster: movie.poster,
        doctor: movie.doctor,
        year: movie.year,
        country: movie.country,
        language: movie.language,
        flash: movie.flash,
        categoryId: movie.categoryId,
      },
    });
  }
);

export const deleteMovie = Api(
  Delete('/api/movies/:id'),
  Params<Id>(),
  ValidateHttp({ params: IdSchema }),
  async () => {
    const id = useParamsId();
    return await prisma.movie.delete({
      where: { id },
    });
  }
);

export const createMovie = Api(
  Post('/api/movies'),
  Validate(MovieSchema),
  async (movie: z.infer<typeof MovieSchema>) => {
    return await prisma.movie.create({
      data: {
        title: movie.title,
        summary: movie.summary,
        poster: movie.poster,
        doctor: movie.doctor,
        year: movie.year,
        country: movie.country,
        language: movie.language,
        flash: movie.flash,
      },
    });
  }
);
