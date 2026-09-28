import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCertificadoDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  @IsInt()
  ID_Usuario!: number;

  @ApiProperty({ example: 1, description: 'ID do curso concluído' })
  @IsInt()
  ID_Curso!: number;

  @ApiProperty({ example: null, required: false, nullable: true, description: 'ID da trilha (opcional)' })
  @IsOptional()
  @IsInt()
  ID_Trilha?: number | null;

  @ApiProperty({ required: false, description: 'Gerado automaticamente se não for enviado' })
  @IsOptional()
  @IsString()
  CodigoVerificacao?: string;
}
