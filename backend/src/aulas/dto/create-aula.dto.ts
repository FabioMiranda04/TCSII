import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateAulaDto {
  @ApiProperty({ example: 1, description: 'ID do módulo' })
  @IsInt()
  ID_Modulo!: number;

  @ApiProperty({ example: 'Instalando o Node.js', description: 'Título da aula' })
  @IsString()
  @IsNotEmpty()
  Titulo!: string;

  @ApiProperty({ example: 'Vídeo', enum: ['Vídeo', 'Texto', 'Quiz'] })
  @IsIn(['Vídeo', 'Texto', 'Quiz'])
  TipoConteudo!: string;

  @ApiProperty({ example: 'https://youtube.com/watch?v=abc', description: 'URL do conteúdo' })
  @IsString()
  @IsNotEmpty()
  URL_Conteudo!: string;

  @ApiProperty({ example: 15, description: 'Duração em minutos' })
  @IsInt()
  @Min(1)
  DuracaoMinutos!: number;

  @ApiProperty({ example: 1, description: 'Posição da aula dentro do módulo' })
  @IsInt()
  @Min(1)
  Ordem!: number;
}
