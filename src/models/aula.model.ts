import { z } from 'zod';

export interface IAula {
  ID_Aula?: string;
  ID_Modulo: string;
  Titulo: string;
  TipoConteudo: 'Vídeo' | 'Texto' | 'Quiz';
  URL_Conteudo: string;
  DuracaoMinutos: number;
  Ordem: number;
}

export const aulaSchema = z.object({
  ID_Aula: z.string().optional(),
  ID_Modulo: z.string().min(1, 'O módulo associado é obrigatório'),
  Titulo: z.string().min(3, 'O título da aula deve ter pelo menos 3 caracteres'),
  TipoConteudo: z.enum(['Vídeo', 'Texto', 'Quiz']),
  URL_Conteudo: z.string().min(1, 'A URL de conteúdo é obrigatória'),
  DuracaoMinutos: z.preprocess((val) => Number(val), z.number().int().positive('A duração em minutos deve ser positiva')),
  Ordem: z.preprocess((val) => Number(val), z.number().int().positive('A ordem deve ser um número positivo'))
});
