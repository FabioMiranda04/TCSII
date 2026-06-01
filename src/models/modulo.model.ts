import { z } from 'zod';

export interface IModulo {
  ID_Modulo?: string;
  ID_Curso: string;
  Titulo: string;
  Ordem: number;
}

export const moduloSchema = z.object({
  ID_Modulo: z.string().optional(),
  ID_Curso: z.string().min(1, 'O curso associado é obrigatório'),
  Titulo: z.string().min(3, 'O título do módulo deve ter pelo menos 3 caracteres'),
  Ordem: z.preprocess((val) => Number(val), z.number().int().positive('A ordem deve ser um número positivo'))
});
