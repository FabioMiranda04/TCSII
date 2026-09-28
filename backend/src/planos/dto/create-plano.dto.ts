import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreatePlanoDto {
  @ApiProperty({ example: 'Premium', description: 'Nome do plano' })
  @IsString()
  @IsNotEmpty()
  Nome!: string;

  @ApiProperty({ example: 'Acesso ilimitado a todos os cursos', required: false })
  @IsOptional()
  @IsString()
  Descricao?: string;

  @ApiProperty({ example: 49.9, description: 'Preço do plano' })
  @IsNumber()
  @IsPositive()
  Preco!: number;

  @ApiProperty({ example: 12, description: 'Duração em meses' })
  @IsInt()
  @IsPositive()
  DuracaoMeses!: number;
}
