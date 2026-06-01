import { z } from 'zod';

export interface IUsuario {
  ID_Usuario?: string;
  NomeCompleto: string;
  Email: string;
  SenhaHash: string;
  DataCadastro: string;
  ID_Plano?: string; // Links to current active Plan
}

export const usuarioSchema = z.object({
  ID_Usuario: z.string().optional(),
  NomeCompleto: z.string().min(3, 'O nome completo deve ter pelo menos 3 caracteres'),
  Email: z.string().email('E-mail inválido'),
  SenhaHash: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  DataCadastro: z.string().min(8, 'Data de cadastro é obrigatória'),
  ID_Plano: z.string().optional()
});
