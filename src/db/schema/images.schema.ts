import { createInsertSchema } from "drizzle-zod";
import { TbImages } from "../table";
import { z } from "zod";

export const imagesSchema = createInsertSchema(TbImages, {
  imageUrl: z.string().url(),
});

export const imagesInsert = createInsertSchema(TbImages, {
  imageUrl: z.string().url(),
});

export type Images = z.infer<typeof imagesSchema>;
export type ImagesInsert = z.infer<typeof imagesInsert>;
