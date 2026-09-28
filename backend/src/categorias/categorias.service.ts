import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  create(createCategoriaDto: CreateCategoriaDto) {
    return this.prisma.categoria.create({ data: createCategoriaDto });
  }

  findAll() {
    return this.prisma.categoria.findMany();
  }

  findOne(id: number) {
    return this.prisma.categoria.findUnique({ where: { ID_Categoria: id } });
  }

  update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return this.prisma.categoria.update({
      where: { ID_Categoria: id },
      data: updateCategoriaDto,
    });
  }

  remove(id: number) {
    return this.prisma.categoria.delete({ where: { ID_Categoria: id } });
  }
}
