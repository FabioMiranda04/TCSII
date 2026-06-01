import { z } from 'zod';

export interface ITrilhaCurso {
  id?: string; // Standard json-server identifier if needed, though PK is composite (ID_Trilha, ID_Curso)
  ID_Trilha: string;
  ID_Curso: string;
  Ordem: number;
}

export const trilhaCursoSchema = z.object({
  id: z.string().optional(),
  ID_Trilha: z.string().min(1, 'O ID da trilha é obrigatório'),
  ID_Curso: z.string().min(1, 'O ID do curso é obrigatório'),
  Ordem: z.preprocess((val) => Number(val), z.number().int().positive('A ordem deve ser um número positivo'))
});
