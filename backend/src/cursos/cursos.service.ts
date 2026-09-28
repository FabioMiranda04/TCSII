import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  create(createCursoDto: CreateCursoDto) {
    return this.prisma.curso.create({ data: createCursoDto });
  }

  // Filtro opcional: listar cursos de uma categoria específica
  findAll(ID_Categoria?: number) {
    return this.prisma.curso.findMany({ where: { ID_Categoria } });
  }

  findOne(id: number) {
    return this.prisma.curso.findUnique({ where: { ID_Curso: id } });
  }

  update(id: number, updateCursoDto: UpdateCursoDto) {
    return this.prisma.curso.update({
      where: { ID_Curso: id },
      data: updateCursoDto,
    });
  }

  remove(id: number) {
    return this.prisma.curso.delete({ where: { ID_Curso: id } });
  }
}
