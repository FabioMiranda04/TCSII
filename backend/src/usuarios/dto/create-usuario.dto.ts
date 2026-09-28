import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome completo' })
  @IsString()
  @IsNotEmpty()
  NomeCompleto!: string;

  @ApiProperty({ example: 'joao@email.com', description: 'O email do usuário' })
  @IsEmail()
  Email!: string;

  @ApiProperty({ example: 'senha123', description: 'Senha com no mínimo 6 caracteres (salva como hash)', minLength: 6 })
  @IsString()
  @MinLength(6)
  SenhaHash!: string;
}
