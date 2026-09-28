import { PartialType } from '@nestjs/swagger';
import { CreateAvaliacoeDto } from './create-avaliacoe.dto';

export class UpdateAvaliacoeDto extends PartialType(CreateAvaliacoeDto) {}
