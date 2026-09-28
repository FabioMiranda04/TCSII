import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvaliacoeDto } from './dto/create-avaliacoe.dto';
import { UpdateAvaliacoeDto } from './dto/update-avaliacoe.dto';

@Injectable()
export class AvaliacoesService {
  constructor(private prisma: PrismaService) {}

  create(createAvaliacoeDto: CreateAvaliacoeDto) {
    return this.prisma.avaliacao.create({ data: createAvaliacoeDto });
  }

  // Filtro opcional: avaliações de um curso específico
  findAll(ID_Curso?: number) {
    return this.prisma.avaliacao.findMany({ where: { ID_Curso } });
  }

  findOne(id: number) {
    return this.prisma.avaliacao.findUnique({ where: { ID_Avaliacao: id } });
  }

  update(id: number, updateAvaliacoeDto: UpdateAvaliacoeDto) {
    return this.prisma.avaliacao.update({
      where: { ID_Avaliacao: id },
      data: updateAvaliacoeDto,
    });
  }

  remove(id: number) {
    return this.prisma.avaliacao.delete({ where: { ID_Avaliacao: id } });
  }
}
