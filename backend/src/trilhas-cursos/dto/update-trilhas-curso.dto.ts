import { PartialType } from '@nestjs/swagger';
import { CreateTrilhasCursoDto } from './create-trilhas-curso.dto';

export class UpdateTrilhasCursoDto extends PartialType(CreateTrilhasCursoDto) {}
