import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateTrilhasCursoDto {
  @ApiProperty({ example: 1, description: 'ID da trilha' })
  @IsInt()
  ID_Trilha!: number;

  @ApiProperty({ example: 1, description: 'ID do curso' })
  @IsInt()
  ID_Curso!: number;

  @ApiProperty({ example: 1, description: 'Posição do curso dentro da trilha' })
  @IsInt()
  @Min(1)
  Ordem!: number;
}
