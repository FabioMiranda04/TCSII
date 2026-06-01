import { z } from 'zod';

export interface ICertificado {
  ID_Certificado?: string;
  ID_Usuario: string;
  ID_Curso: string;
  ID_Trilha?: string | null;
  CodigoVerificacao: string;
  DataEmissao: string;
}

export const certificadoSchema = z.object({
  ID_Certificado: z.string().optional(),
  ID_Usuario: z.string().min(1, 'O ID do usuário é obrigatório'),
  ID_Curso: z.string().min(1, 'O ID do curso é obrigatório'),
  ID_Trilha: z.string().nullable().optional(),
  CodigoVerificacao: z.string().min(4, 'O código de verificação é obrigatório'),
  DataEmissao: z.string().min(8, 'A data de emissão é obrigatória')
});
