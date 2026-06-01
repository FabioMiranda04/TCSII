import { z } from 'zod';

export interface IAvaliacao {
  ID_Avaliacao?: string;
  ID_Usuario: string;
  ID_Curso: string;
  Nota: number;
  Comentario?: string | null;
  DataAvaliacao: string;
}

export const avaliacaoSchema = z.object({
  ID_Avaliacao: z.string().optional(),
  ID_Usuario: z.string().min(1, 'O ID do usuário é obrigatório'),
  ID_Curso: z.string().min(1, 'O ID do curso é obrigatório'),
  Nota: z.preprocess((val) => Number(val), z.number().int().min(1).max(5, 'A nota deve ser de 1 a 5')),
  Comentario: z.string().nullable().optional(),
  DataAvaliacao: z.string().min(8, 'A data da avaliação é obrigatória')
});
