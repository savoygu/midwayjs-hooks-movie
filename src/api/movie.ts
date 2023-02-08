import { Api, Post, Validate } from '@midwayjs/hooks';
import { prisma } from './prisma';

import { z } from 'zod';

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

export const createMovie = Api(
  Post('/movie'),
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
