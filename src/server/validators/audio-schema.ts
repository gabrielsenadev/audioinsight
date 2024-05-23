import { z } from 'zod';

const MAX_AUDIO_SIZE = 5 * 1024 * 1024 * 1024;

export default z
  .instanceof(Blob)
  .refine(({ type }) => type.startsWith('audio/'), {
    message: 'Invalid file',
  })
  .refine(({ size }) => size > 0, {
    message: 'File too small',
  })
  .refine(({ size }) => size <= MAX_AUDIO_SIZE, {
    message: `File too big. Limit ${MAX_AUDIO_SIZE / 1024} kb.`
  });
