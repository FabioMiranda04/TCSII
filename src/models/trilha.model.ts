import { z } from 'zod';

export interface ITrilha {
  ID_Trilha?: string;
  Titulo: string;
  Descricao: string;
  ID_Categoria: string;
  cursosCount?: number;
  cargaHoraria?: string;
  progresso?: number;
  gradient?: string;
  icon?: string;
}

export const trilhaSchema = z.object({
  ID_Trilha: z.string().optional(),
  Titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  Descricao: z.string().min(5, 'A descrição deve ter pelo menos 5 caracteres'),
  ID_Categoria: z.string().min(1, 'A categoria associada é obrigatória'),
  cursosCount: z.number().optional().default(5),
  cargaHoraria: z.string().optional().default('40 horas'),
  progresso: z.number().optional().default(0),
  gradient: z.string().optional().default('linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)'),
  icon: z.string().optional().default('bi-compass')
});
