import { z } from "zod";

export const categorySchema = z
  .object({
    name: z.string().min(1, "Name required"),
    description: z.string().optional(),
    icon: z.string().optional(),
    imageFile: z.any().optional(),
    isActive: z.boolean(),
  })
  .refine((data) => data.icon || data.imageFile, {
    message: "Please select icon or upload image",
    path: ["icon"],
  });
