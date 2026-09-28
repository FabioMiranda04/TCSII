import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgressoAulaDto } from './dto/create-progresso-aula.dto';
import { UpdateProgressoAulaDto } from './dto/update-progresso-aula.dto';

// Chave primária composta: (ID_Usuario, ID_Aula)
@Injectable()
export class ProgressoAulasService {
  constructor(private prisma: PrismaService) {}

  create(createProgressoAulaDto: CreateProgressoAulaDto) {
    return this.prisma.progressoAula.create({ data: createProgressoAulaDto });
  }

  // Filtro opcional: progresso de um usuário
  findAll(ID_Usuario?: number) {
    return this.prisma.progressoAula.findMany({ where: { ID_Usuario } });
  }

  findOne(ID_Usuario: number, ID_Aula: number) {
    return this.prisma.progressoAula.findUnique({
      where: { ID_Usuario_ID_Aula: { ID_Usuario, ID_Aula } },
    });
  }

  update(ID_Usuario: number, ID_Aula: number, updateProgressoAulaDto: UpdateProgressoAulaDto) {
    return this.prisma.progressoAula.update({
      where: { ID_Usuario_ID_Aula: { ID_Usuario, ID_Aula } },
      data: updateProgressoAulaDto,
    });
  }

  remove(ID_Usuario: number, ID_Aula: number) {
    return this.prisma.progressoAula.delete({
      where: { ID_Usuario_ID_Aula: { ID_Usuario, ID_Aula } },
    });
  }
}
