import { z } from 'zod';

export interface ICategoria {
  ID_Categoria?: string;
  Nome: string;
  Descricao: string;
}

export const categoriaSchema = z.object({
  ID_Categoria: z.string().optional(),
  Nome: z.string().min(2, 'O nome da categoria deve ter pelo menos 2 caracteres'),
  Descricao: z.string().min(5, 'A descrição deve ter pelo menos 5 caracteres')
});
