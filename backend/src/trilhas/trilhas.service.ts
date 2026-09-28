import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrilhaDto } from './dto/create-trilha.dto';
import { UpdateTrilhaDto } from './dto/update-trilha.dto';

@Injectable()
export class TrilhasService {
  constructor(private prisma: PrismaService) {}

  create(createTrilhaDto: CreateTrilhaDto) {
    return this.prisma.trilha.create({ data: createTrilhaDto });
  }

  // Filtro opcional: listar trilhas de uma categoria específica
  findAll(ID_Categoria?: number) {
    return this.prisma.trilha.findMany({ where: { ID_Categoria } });
  }

  findOne(id: number) {
    return this.prisma.trilha.findUnique({ where: { ID_Trilha: id } });
  }

  update(id: number, updateTrilhaDto: UpdateTrilhaDto) {
    return this.prisma.trilha.update({
      where: { ID_Trilha: id },
      data: updateTrilhaDto,
    });
  }

  remove(id: number) {
    return this.prisma.trilha.delete({ where: { ID_Trilha: id } });
  }
}
