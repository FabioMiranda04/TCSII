import { PartialType } from '@nestjs/swagger';
import { CreateProgressoAulaDto } from './create-progresso-aula.dto';

export class UpdateProgressoAulaDto extends PartialType(CreateProgressoAulaDto) {}
