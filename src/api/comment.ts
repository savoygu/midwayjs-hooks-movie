import type { ApiConfig } from '@midwayjs/hooks';
import {
  Api,
  Delete,
  Params,
  Post,
  Put,
  Validate,
  ValidateHttp,
  useContext,
} from '@midwayjs/hooks';
import type { Context } from '@midwayjs/koa';
import { z } from 'zod';
import { signInRequired } from './middleware/permission';
import { useParams, useParamsId } from './context';
import { prisma } from './prisma';
import type { Id } from './schema';
import { IdSchema } from './schema';
import { COMMENT_SELECT_FIELDS } from './select';

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
    return await prisma.comment
      .create({
        data: {
          content: comment.content,
          parentId: comment.parentId,
          userId: ctx.session.user.id,
          movieId,
        },
        select: COMMENT_SELECT_FIELDS,
      })
      .then(comment => {
        return {
          ...comment,
          likeCount: 0,
          likedByMe: false,
        };
      });
  }
);

export const updateComment = Api(
  Put('/api/movies/:movieId/comments/:commentId'),
  Params<Ids>(),
  ValidateHttp({ params: IdsSchema }),
  async (comment: z.infer<typeof CommentSchema>) => {
    const ctx = useContext<Context>();
    const { commentId } = useParams();

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
    const { commentId } = useParams();

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

export const toggleCommentLike = Api(
  Post('/api/movies/:movieId/comments/:commentId/toggleLike'),
  Params<Ids>(),
  ValidateHttp({ params: IdsSchema }),
  async () => {
    const ctx = useContext<Context>();
    const { commentId } = useParams();
    const data = {
      commentId: Number(commentId),
      userId: ctx.session.user?.id,
    };

    const like = await prisma.like.findUnique({
      where: {
        userId_commentId: data,
      },
    });

    if (like === null) {
      return await prisma.like.create({ data }).then(() => {
        return { addLike: true };
      });
    } else {
      return await prisma.like
        .delete({ where: { userId_commentId: data } })
        .then(() => {
          return { addLike: false };
        });
    }
  }
);
