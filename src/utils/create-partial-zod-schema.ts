import { z } from 'zod';

type OptionalSchema<T extends z.ZodTypeAny> =
  T extends z.ZodObject<infer Shape>
    ? z.ZodObject<{ [K in keyof Shape]: z.ZodOptional<Shape[K]> }>
    : z.ZodOptional<T>;

export function makePartialSchema<T extends z.ZodTypeAny>(
  schema: T,
): OptionalSchema<T> {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const newShape: Record<string, z.ZodTypeAny> = {};

    for (const key in shape) {
      if (shape.hasOwnProperty(key)) {
        newShape[key] = makePartialSchema(shape[key]);
      }
    }

    return z.object(newShape) as unknown as OptionalSchema<T>;
  }

  return schema.optional() as OptionalSchema<T>;
}
