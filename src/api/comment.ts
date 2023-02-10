import {
  Api,
  Delete,
  Params,
  Post,
  Put,
  useContext,
  Validate,
  ValidateHttp,
} from '@midwayjs/hooks';
import type { Context } from '@midwayjs/koa';
import { z } from 'zod';
import { useParams, useParamsId } from './context';
import { prisma } from './prisma';
import { Id, IdSchema } from './schema';
import { COMMENT_SELECT_FIELDS } from './select';

const CommentSchema = z.object({
  content: z.string().min(1),
  parentId: z.number().optional(),
});

export const createComment = Api(
  Post('/api/movies/:id/comments'),
  Params<Id>(),
  ValidateHttp({ params: IdSchema }),
  Validate(CommentSchema),
  async (comment: z.infer<typeof CommentSchema>) => {
    const ctx = useContext<Context>();
    const movieId = useParamsId();
    return await prisma.comment.create({
      data: {
        content: comment.content,
        parentId: comment.parentId,
        userId: Number(ctx.cookies.get('userId') ?? 3), // TODO logged user id
        movieId,
      },
      select: COMMENT_SELECT_FIELDS,
    });
  }
);

const IdsSchema = z.object({
  movieId: z.string().regex(/^\d+$/),
  commentId: z.string().regex(/^\d+$/),
});

type Ids = z.infer<typeof IdsSchema>;

export const updateComment = Api(
  Put('/api/movies/:movieId/comments/:commentId'),
  Params<Ids>(),
  ValidateHttp({ params: IdsSchema }),
  async (comment: z.infer<typeof CommentSchema>) => {
    const ctx = useContext<Context>();
    const { movieId, commentId } = useParams();

    const { userId } = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
      select: {
        userId: true,
      },
    });

    if (userId !== (ctx.cookies.get('userId') ?? 3)) {
      // TODO logged user id
      throw ctx.throw(403, 'no update permission');
    }

    return await prisma.comment.update({
      where: { id: Number(commentId) },
      data: {
        content: comment.content,
      },
      select: {
        content: true,
      },
    });
  }
);

export const deleteComment = Api(
  Delete('/api/movies/:movieId/comments/:commentId'),
  Params<Ids>(),
  ValidateHttp({ params: IdsSchema }),
  async () => {
    const ctx = useContext<Context>();
    const { movieId, commentId } = useParams();

    const { userId } = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
      select: {
        userId: true,
      },
    });

    if (userId !== (ctx.cookies.get('userId') ?? 3)) {
      // TODO logged user id
      throw ctx.throw(403, 'no delete permission');
    }

    return await prisma.comment.delete({
      where: { id: Number(commentId) },
      select: {
        id: true,
      },
    });
  }
);
