import { z } from "zod";

export const roomSchema = z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: "El nombre no puede estar vacío" })
      .max(32, { message: "El nombre no puede tener más de 32 caracteres" })
      .regex(/^[ -~]+$/, {
        message: "El nombre solo puede contener caracteres ASCII",
      }),
    minPlayers: z
      .number()
      .int(),
    maxPlayers: z
      .number()
      .int(),
  }).refine(data => data.minPlayers <= data.maxPlayers, {
    message: "El mínimo de jugadores debe ser menor o igual al máximo",
    });
