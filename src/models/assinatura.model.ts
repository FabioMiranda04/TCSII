import { z } from 'zod';

// 1. Planos
export interface IPlano {
  ID_Plano?: string;
  Nome: string;
  Descricao?: string;
  Preco: number;
  DuracaoMeses: number;
}

export const planoSchema = z.object({
  ID_Plano: z.string().optional(),
  Nome: z.string().min(3, 'O nome do plano deve ter pelo menos 3 caracteres'),
  Descricao: z.string().optional(),
  Preco: z.preprocess((val) => Number(String(val).replace(/[^\d,.-]/g, '').replace(',', '.')), z.number().positive('O preço deve ser positivo')),
  DuracaoMeses: z.preprocess((val) => Number(val), z.number().int().positive('A duração deve ser positiva'))
});

// 2. Assinaturas
export interface IAssinatura {
  ID_Assinatura?: string;
  ID_Usuario: string;
  ID_Plano: string;
  DataInicio: string;
  DataFim: string;
}

export const assinaturaSchema = z.object({
  ID_Assinatura: z.string().optional(),
  ID_Usuario: z.string().min(1, 'O ID do usuário é obrigatório'),
  ID_Plano: z.string().min(1, 'O ID do plano é obrigatório'),
  DataInicio: z.string().min(8, 'Data de início é obrigatória'),
  DataFim: z.string().min(8, 'Data de fim é obrigatória')
});

// 3. Pagamentos
export interface IPagamento {
  ID_Pagamento?: string;
  ID_Assinatura: string;
  ValorPago: number;
  DataPagamento: string;
  MetodoPagamento: string;
  Id_Transacao_Gateway: string;
  DataFim: string;
}

export const pagamentoSchema = z.object({
  ID_Pagamento: z.string().optional(),
  ID_Assinatura: z.string().min(1, 'O ID da assinatura é obrigatório'),
  ValorPago: z.preprocess((val) => Number(val), z.number().positive('O valor pago deve ser positivo')),
  DataPagamento: z.string().min(8, 'A data do pagamento é obrigatória'),
  MetodoPagamento: z.string().min(1, 'O método de pagamento é obrigatório'),
  Id_Transacao_Gateway: z.string().min(1, 'O ID da transação é obrigatório'),
  DataFim: z.string().min(8, 'Data fim é obrigatória')
});
