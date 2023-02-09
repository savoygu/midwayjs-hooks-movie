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

export const getMovie = Api(
  Get('/api/movie/:id'),
  Params<Id>(),
  ValidateHttp({ params: IdSchema }),
  async () => {
    const id = useParamsId();
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: { category: true },
    });
    return movie;
  }
);

export const getMovies = Api(Get('/api/movies'), async () => {
  const movies = await prisma.movie.findMany();
  return movies;
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
  Put('/api/movie'),
  Validate(FullMovieSchema),
  async (movie: z.infer<typeof FullMovieSchema>) => {
    const result = await prisma.movie.update({
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
    return result;
  }
);

export const deleteMovie = Api(
  Delete('/api/movie/:id'),
  Params<Id>(),
  ValidateHttp({ params: IdSchema }),
  async () => {
    const id = useParamsId();
    const movie = await prisma.movie.delete({
      where: { id },
    });
    return movie;
  }
);

export const createMovie = Api(
  Post('/api/movie'),
  Validate(MovieSchema),
  async (movie: z.infer<typeof MovieSchema>) => {
    const result = await prisma.movie.create({
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
    return result;
  }
);
