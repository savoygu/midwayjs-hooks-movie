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

export const getCategory = Api(
  Get('/api/category/:id'),
  Params<Id>(),
  ValidateHttp({ params: IdSchema }),
  async () => {
    const id = useParamsId();
    const category = await prisma.category.findUnique({
      where: { id },
    });
    return category;
  }
);

export const getCategories = Api(Get('/api/categories'), async () => {
  const categories = await prisma.category.findMany();
  return categories;
});

const CategorySchema = z.object({
  name: z.string().min(1),
});

const FullCategorySchema = CategorySchema.merge(
  z.object({
    id: z.number(),
  })
);

export const updateCategory = Api(
  Put('/api/category'),
  Validate(FullCategorySchema),
  async (category: z.infer<typeof FullCategorySchema>) => {
    const result = await prisma.category.update({
      where: { id: category.id },
      data: {
        name: category.name,
      },
    });
    return result;
  }
);

export const deleteCategory = Api(
  Delete('/api/category/:id'),
  Params<Id>(),
  ValidateHttp({ params: IdSchema }),
  async () => {
    const id = useParamsId();
    const category = await prisma.category.delete({
      where: { id },
    });
    return category;
  }
);

export const createCategory = Api(
  Post('/api/category'),
  Validate(CategorySchema),
  async (category: z.infer<typeof CategorySchema>) => {
    const result = await prisma.category.create({
      data: {
        name: category.name,
      },
    });
    return result;
  }
);
