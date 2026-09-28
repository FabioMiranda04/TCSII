import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePagamentoDto {
  @ApiProperty({ example: 1, description: 'ID da assinatura' })
  @IsInt()
  ID_Assinatura!: number;

  @ApiProperty({ example: 49.9, description: 'Valor pago (preço do plano)' })
  @IsNumber()
  @IsPositive()
  ValorPago!: number;

  @ApiProperty({ example: '2026-06-11', description: 'Data do pagamento' })
  @Type(() => Date)
  @IsDate()
  DataPagamento!: Date;

  @ApiProperty({ example: 'Cartão de Crédito', description: 'Método de pagamento' })
  @IsString()
  @IsNotEmpty()
  MetodoPagamento!: string;

  @ApiProperty({ example: 'TXN-8F2A91', description: 'ID da transação no gateway' })
  @IsString()
  @IsNotEmpty()
  Id_Transacao_Gateway!: string;

  @ApiProperty({ example: '2027-06-11', description: 'Data de fim do período pago' })
  @Type(() => Date)
  @IsDate()
  DataFim!: Date;
}
