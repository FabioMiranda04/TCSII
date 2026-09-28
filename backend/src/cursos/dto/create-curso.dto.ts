import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCursoDto {
  @ApiProperty({ example: 'NestJS do Zero', description: 'Título do curso' })
  @IsString()
  @IsNotEmpty()
  Titulo!: string;

  @ApiProperty({ example: 'Aprenda a criar APIs com NestJS', required: false })
  @IsOptional()
  @IsString()
  Descricao?: string;

  @ApiProperty({ example: 1, description: 'ID do usuário instrutor' })
  @IsInt()
  ID_Instrutor!: number;

  @ApiProperty({ example: 1, description: 'ID da categoria' })
  @IsInt()
  ID_Categoria!: number;

  @ApiProperty({ example: 'Iniciante', enum: ['Iniciante', 'Intermediário', 'Avançado'] })
  @IsIn(['Iniciante', 'Intermediário', 'Avançado'])
  Nivel!: string;

  @ApiProperty({ example: '2026-06-11', required: false, description: 'Padrão: data atual' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  DataPublicacao?: Date;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  TotalAulas?: number;

  @ApiProperty({ example: 20, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  TotalHoras?: number;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1516116211223-5c359a36298a', required: false })
  @IsOptional()
  @IsUrl()
  Imagem?: string;
}
