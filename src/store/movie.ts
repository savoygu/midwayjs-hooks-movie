import type { Category, Comment, Movie } from '@prisma/client';
import { defineStore } from 'pinia';
import { getMovie } from '../api/movie';

type StoreMovie = Movie & {
  category: Category;
  comments: Comment[];
};

interface MovieState {
  movie: Partial<StoreMovie>;
  comments: Comment[];
}

export const useMovieStore = defineStore('movie', {
  state: (): MovieState => {
    return {
      movie: {},
      comments: [],
    };
  },
  getters: {
    commentsByParentId(state) {
      return state.comments.reduce((group, comment) => {
        group[comment.parentId] ||= [];
        group[comment.parentId].push(comment);
        return group;
      }, {});
    },
    rootComments() {
      return this.commentsByParentId.null;
    },
  },
  actions: {
    async getMovie(id: string) {
      const movie = (this.movie = await getMovie({
        params: { id },
      }));
      this.comments = movie.comments;
    },
    getReplies(parentId: any) {
      return this.commentsByParentId[parentId];
    },
    createLocalComment(comment) {
      this.comments = [comment, ...this.comments];
    },
    updateLocalComment(id: number, content: string) {
      this.comments = this.comments.map(comment => {
        if (comment.id === id) {
          return { ...comment, content };
        } else {
          return comment;
        }
      });
    },
    deleteLocalComment(id: number) {
      this.comments = this.comments.filter(comment => comment.id !== id);
    },
    toggleLocalCommentLike(id: number, addLike: boolean) {
      this.comments = this.comments.map(comment => {
        if (id === comment.id) {
          if (addLike) {
            return {
              ...comment,
              likeCount: comment.likeCount + 1,
              likedByMe: true,
            };
          } else {
            return {
              ...comment,
              likeCount: comment.likeCount - 1,
              likedByMe: false,
            };
          }
        } else {
          return comment;
        }
      });
    },
  },
});
