import {
  Api,
  ApiConfig,
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
import { signInRequired } from '../middleware/permission';

export const config: ApiConfig = {
  middleware: [signInRequired],
};

const IdsSchema = z.object({
  movieId: z.string().regex(/^\d+$/),
  commentId: z.string().regex(/^\d+$/),
});

type Ids = z.infer<typeof IdsSchema>;

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
        userId: ctx.session.user.id,
        movieId,
      },
      select: COMMENT_SELECT_FIELDS,
    });
  }
);

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

    console.log('FROM updateComment', ctx.session.user);

    if (userId !== ctx.session.user?.id) {
      ctx.throw(401, 'no update permission');
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

    console.log('FROM deleteComment', ctx.session.user);

    if (userId !== ctx.session.user?.id) {
      ctx.throw(401, 'no delete permission');
    }

    return await prisma.comment.delete({
      where: { id: Number(commentId) },
      select: {
        id: true,
      },
    });
  }
);
