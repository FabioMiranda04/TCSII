import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({ example: 'Programação', description: 'Nome da categoria (único)' })
  @IsString()
  @IsNotEmpty()
  Nome!: string;

  @ApiProperty({ example: 'Cursos de desenvolvimento de software', required: false })
  @IsOptional()
  @IsString()
  Descricao?: string;
}
