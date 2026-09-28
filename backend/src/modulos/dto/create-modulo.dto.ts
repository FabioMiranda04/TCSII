import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateModuloDto {
  @ApiProperty({ example: 1, description: 'ID do curso' })
  @IsInt()
  ID_Curso!: number;

  @ApiProperty({ example: 'Introdução', description: 'Título do módulo' })
  @IsString()
  @IsNotEmpty()
  Titulo!: string;

  @ApiProperty({ example: 1, description: 'Posição do módulo dentro do curso' })
  @IsInt()
  @Min(1)
  Ordem!: number;
}
