import { z } from 'zod';

/** Chave composta: (ID_Usuario, ID_Aula). */
export interface IProgresso {
  ID_Usuario: string;
  ID_Aula: string;
  DataConclusao: string;
  Status: 'Concluído';
}

export const progressoSchema = z.object({
  ID_Usuario: z.string().min(1, 'O ID do usuário é obrigatório'),
  ID_Aula: z.string().min(1, 'O ID da aula é obrigatório'),
  DataConclusao: z.string().min(8, 'A data de conclusão é obrigatória'),
  Status: z.literal('Concluído').default('Concluído')
});
