import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProgressoAulaDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  @IsInt()
  ID_Usuario!: number;

  @ApiProperty({ example: 1, description: 'ID da aula' })
  @IsInt()
  ID_Aula!: number;

  @ApiProperty({ example: '2026-06-11', required: false, description: 'Padrão: data atual' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  DataConclusao?: Date;

  @ApiProperty({ example: 'Concluído', required: false, description: 'Padrão: Concluído' })
  @IsOptional()
  @IsString()
  Status?: string;
}
