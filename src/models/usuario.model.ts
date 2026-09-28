import { z } from 'zod';

export interface IUsuario {
  ID_Usuario?: string;
  NomeCompleto: string;
  Email: string;
  /** Só usado no envio (senha em texto); a API nunca retorna. */
  SenhaHash?: string;
  /** Gerada pelo backend (ISO). */
  DataCadastro?: string;
  /** Não existe no backend; o plano vem de /assinaturas?ID_Usuario=. Mantido por compatibilidade. */
  ID_Plano?: string;
}

const base = {
  ID_Usuario: z.string().optional(),
  NomeCompleto: z.string().min(3, 'O nome completo deve ter pelo menos 3 caracteres'),
  Email: z.string().email('E-mail inválido'),
  DataCadastro: z.string().optional(),
  ID_Plano: z.string().optional(),
};

/** Criação: senha obrigatória. */
export const usuarioSchema = z.object({
  ...base,
  SenhaHash: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

/** Edição: senha opcional (vazio = não alterar). */
export const usuarioEdicaoSchema = z.object({
  ...base,
  SenhaHash: z.union([z.literal(''), z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')]).optional(),
});
