import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

@Injectable()
export class AulasService {
  constructor(private prisma: PrismaService) {}

  create(createAulaDto: CreateAulaDto) {
    return this.prisma.aula.create({ data: createAulaDto });
  }

  // Filtro opcional por módulo, sempre respeitando o campo Ordem
  findAll(ID_Modulo?: number) {
    return this.prisma.aula.findMany({ where: { ID_Modulo }, orderBy: { Ordem: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.aula.findUnique({ where: { ID_Aula: id } });
  }

  update(id: number, updateAulaDto: UpdateAulaDto) {
    return this.prisma.aula.update({
      where: { ID_Aula: id },
      data: updateAulaDto,
    });
  }

  remove(id: number) {
    return this.prisma.aula.delete({ where: { ID_Aula: id } });
  }
}
