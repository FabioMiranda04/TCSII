import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTrilhaDto {
  @ApiProperty({ example: 'Formação Back-end', description: 'Título da trilha' })
  @IsString()
  @IsNotEmpty()
  Titulo!: string;

  @ApiProperty({ example: 'Do zero ao deploy de APIs', required: false })
  @IsOptional()
  @IsString()
  Descricao?: string;

  @ApiProperty({ example: 1, description: 'ID da categoria' })
  @IsInt()
  ID_Categoria!: number;
}
