import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrilhasCursoDto } from './dto/create-trilhas-curso.dto';
import { UpdateTrilhasCursoDto } from './dto/update-trilhas-curso.dto';

// Tabela associativa com chave primária composta: (ID_Trilha, ID_Curso)
@Injectable()
export class TrilhasCursosService {
  constructor(private prisma: PrismaService) {}

  create(createTrilhasCursoDto: CreateTrilhasCursoDto) {
    return this.prisma.trilhaCurso.create({ data: createTrilhasCursoDto });
  }

  // Filtro opcional por trilha, sempre respeitando o campo Ordem
  findAll(ID_Trilha?: number) {
    return this.prisma.trilhaCurso.findMany({ where: { ID_Trilha }, orderBy: { Ordem: 'asc' } });
  }

  findOne(ID_Trilha: number, ID_Curso: number) {
    return this.prisma.trilhaCurso.findUnique({
      where: { ID_Trilha_ID_Curso: { ID_Trilha, ID_Curso } },
    });
  }

  update(ID_Trilha: number, ID_Curso: number, updateTrilhasCursoDto: UpdateTrilhasCursoDto) {
    return this.prisma.trilhaCurso.update({
      where: { ID_Trilha_ID_Curso: { ID_Trilha, ID_Curso } },
      data: updateTrilhasCursoDto,
    });
  }

  remove(ID_Trilha: number, ID_Curso: number) {
    return this.prisma.trilhaCurso.delete({
      where: { ID_Trilha_ID_Curso: { ID_Trilha, ID_Curso } },
    });
  }
}
