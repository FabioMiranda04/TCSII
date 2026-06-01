import { z } from 'zod';

export interface IProgresso {
  id?: string; // Standard json-server identifier if needed, though primary keys are composite (ID_Usuario, ID_Aula)
  ID_Usuario: string;
  ID_Aula: string;
  DataConclusao: string;
  Status: 'Concluído';
}

export const progressoSchema = z.object({
  id: z.string().optional(),
  ID_Usuario: z.string().min(1, 'O ID do usuário é obrigatório'),
  ID_Aula: z.string().min(1, 'O ID da aula é obrigatório'),
  DataConclusao: z.string().min(8, 'A data de conclusão é obrigatória'),
  Status: z.literal('Concluído').default('Concluído')
});
