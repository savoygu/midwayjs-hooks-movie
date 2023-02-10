export const COMMENT_SELECT_FIELDS = {
  id: true,
  content: true,
  parentId: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};
