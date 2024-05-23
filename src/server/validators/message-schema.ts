import { z } from 'zod';

export default z.object({
  message: z.string({
    message: 'Message property must be a string',
  }),
}, {
  message: 'Input must be a object with a property message as string.',
});

