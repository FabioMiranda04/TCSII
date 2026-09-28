import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';

@Injectable()
export class ModulosService {
  constructor(private prisma: PrismaService) {}

  create(createModuloDto: CreateModuloDto) {
    return this.prisma.modulo.create({ data: createModuloDto });
  }

  // Filtro opcional por curso, sempre respeitando o campo Ordem
  findAll(ID_Curso?: number) {
    return this.prisma.modulo.findMany({ where: { ID_Curso }, orderBy: { Ordem: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.modulo.findUnique({ where: { ID_Modulo: id } });
  }

  update(id: number, updateModuloDto: UpdateModuloDto) {
    return this.prisma.modulo.update({
      where: { ID_Modulo: id },
      data: updateModuloDto,
    });
  }

  remove(id: number) {
    return this.prisma.modulo.delete({ where: { ID_Modulo: id } });
  }
}
