import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAvaliacoeDto {
  @ApiProperty({ example: 1, description: 'ID do usuário que avalia' })
  @IsInt()
  ID_Usuario!: number;

  @ApiProperty({ example: 1, description: 'ID do curso avaliado' })
  @IsInt()
  ID_Curso!: number;

  @ApiProperty({ example: 5, description: 'Nota de 1 a 5', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  Nota!: number;

  @ApiProperty({ example: 'Curso excelente!', required: false })
  @IsOptional()
  @IsString()
  Comentario?: string;
}
