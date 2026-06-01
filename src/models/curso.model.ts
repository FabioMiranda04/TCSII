import { z } from 'zod';

export interface ICurso {
  ID_Curso?: string;
  Titulo: string;
  Descricao: string;
  ID_Instrutor: string;
  ID_Categoria: string;
  Nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  DataPublicacao: string;
  TotalAulas: number;
  TotalHoras: number;
  Imagem: string;
}

export const cursoSchema = z.object({
  ID_Curso: z.string().optional(),
  Titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  Descricao: z.string().min(5, 'A descrição deve ter pelo menos 5 caracteres'),
  ID_Instrutor: z.string().min(1, 'O instrutor é obrigatório'),
  ID_Categoria: z.string().min(1, 'A categoria é obrigatória'),
  Nivel: z.enum(['Iniciante', 'Intermediário', 'Avançado']),
  DataPublicacao: z.string().min(8, 'A data de publicação deve ser informada'),
  TotalAulas: z.preprocess((val) => Number(val), z.number().int().nonnegative('Total de aulas deve ser 0 ou mais')),
  TotalHoras: z.preprocess((val) => Number(val), z.number().int().nonnegative('Total de horas deve ser 0 ou mais')),
  Imagem: z.string().url('A URL da imagem deve ser válida')
});
