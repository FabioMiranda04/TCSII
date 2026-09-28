import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssinaturaDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  @IsInt()
  ID_Usuario!: number;

  @ApiProperty({ example: 1, description: 'ID do plano' })
  @IsInt()
  ID_Plano!: number;

  @ApiProperty({ example: '2026-06-11', description: 'Data de início' })
  @Type(() => Date)
  @IsDate()
  DataInicio!: Date;

  @ApiProperty({ example: '2027-06-11', description: 'Data de fim' })
  @Type(() => Date)
  @IsDate()
  DataFim!: Date;
}
