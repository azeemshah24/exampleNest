import { FILTER_DATE_OPTION } from 'src/constants';
import { z } from 'zod';

export const dateFilterSchema = z
  .object({
    option: z.string({
      message: 'Missing option paramter',
    }),
    range: z
      .object({
        after: z
          .string({
            message: 'Missing after parameter',
          })
          .date('Invalid date after'),
        before: z
          .string({
            message: 'Missing before parameter',
          })
          .date('Invalid date before'),
      })
      .optional(),
  })
  .superRefine((val, ctx) => {
    if (val.option === FILTER_DATE_OPTION.CUSTOM) {
      if (!val.range) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Missing range parameter',
        });
      }
    }
  });
