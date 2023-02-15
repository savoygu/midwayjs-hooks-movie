import type { ApiConfig } from '@midwayjs/hooks';
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
import { adminRequired } from '../middleware/permission';
import { prisma } from './prisma';
import type { Id } from './schema';
import { IdSchema } from './schema';
import { useParamsId } from './context';

export const config: ApiConfig = {
  middleware: [adminRequired],
};

export const getCategory = Api(
  Get('/api/categories/:id'),
  Params<Id>(),
  ValidateHttp({ params: IdSchema }),
  async () => {
    const id = useParamsId();
    return await prisma.category.findUnique({
      where: { id },
    });
  }
);

export const getCategories = Api(Get('/api/categories'), async () => {
  return await prisma.category.findMany();
});

const CategorySchema = z.object({
  name: z.string().min(1),
});

const FullCategorySchema = CategorySchema.partial().merge(
  z.object({
    id: z.number(),
  })
);

export const updateCategory = Api(
  Put('/api/categories'),
  Validate(FullCategorySchema),
  async (category: z.infer<typeof FullCategorySchema>) => {
    return await prisma.category.update({
      where: { id: category.id },
      data: {
        name: category.name,
      },
    });
  }
);

export const deleteCategory = Api(
  Delete('/api/categories/:id'),
  Params<Id>(),
  ValidateHttp({ params: IdSchema }),
  async () => {
    const id = useParamsId();
    return await prisma.category.delete({
      where: { id },
    });
  }
);

export const createCategory = Api(
  Post('/api/categories'),
  Validate(CategorySchema),
  async (category: z.infer<typeof CategorySchema>) => {
    return await prisma.category.create({
      data: {
        name: category.name,
      },
    });
  }
);
