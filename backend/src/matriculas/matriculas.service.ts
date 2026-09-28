import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';

@Injectable()
export class MatriculasService {
  constructor(private prisma: PrismaService) {}

  create(createMatriculaDto: CreateMatriculaDto) {
    return this.prisma.matricula.create({ data: createMatriculaDto });
  }

  // Filtro opcional: matrículas de um usuário
  findAll(ID_Usuario?: number) {
    return this.prisma.matricula.findMany({ where: { ID_Usuario } });
  }

  findOne(id: number) {
    return this.prisma.matricula.findUnique({ where: { ID_Matricula: id } });
  }

  update(id: number, updateMatriculaDto: UpdateMatriculaDto) {
    return this.prisma.matricula.update({
      where: { ID_Matricula: id },
      data: updateMatriculaDto,
    });
  }

  remove(id: number) {
    return this.prisma.matricula.delete({ where: { ID_Matricula: id } });
  }
}
