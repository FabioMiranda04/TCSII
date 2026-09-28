import { z } from 'zod';

export interface IMatricula {
  ID_Matricula?: string;
  ID_Usuario: string;
  ID_Curso: string;
  DataMatricula?: string;
  DataConclusao?: string | null;
}

export const matriculaSchema = z.object({
  ID_Matricula: z.string().optional(),
  ID_Usuario: z.string().min(1, 'O ID do usuário é obrigatório'),
  ID_Curso: z.string().min(1, 'O ID do curso é obrigatório'),
  DataMatricula: z.string().optional(),
  DataConclusao: z.string().nullable().optional()
});
