import { z } from "zod";

const MulterFileSchema = z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string(),
    size: z.number(),
  destination: z.string(),
  filename: z.string(),
  path: z.string(),
  buffer: z.instanceof(Buffer).optional(),
});

export { MulterFileSchema };
