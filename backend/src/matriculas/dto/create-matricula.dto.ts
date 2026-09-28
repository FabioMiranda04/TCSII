import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMatriculaDto {
  @ApiProperty({ example: 1, description: 'ID do usuário (aluno)' })
  @IsInt()
  ID_Usuario!: number;

  @ApiProperty({ example: 1, description: 'ID do curso' })
  @IsInt()
  ID_Curso!: number;

  @ApiProperty({ example: '2026-06-11', required: false, description: 'Padrão: data atual' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  DataMatricula?: Date;

  @ApiProperty({ example: null, required: false, nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  DataConclusao?: Date | null;
}
