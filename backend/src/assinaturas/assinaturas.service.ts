import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';

@Injectable()
export class AssinaturasService {
  constructor(private prisma: PrismaService) {}

  create(createAssinaturaDto: CreateAssinaturaDto) {
    return this.prisma.assinatura.create({ data: createAssinaturaDto });
  }

  // Filtro opcional: assinaturas de um usuário
  findAll(ID_Usuario?: number) {
    return this.prisma.assinatura.findMany({ where: { ID_Usuario } });
  }

  findOne(id: number) {
    return this.prisma.assinatura.findUnique({ where: { ID_Assinatura: id } });
  }

  update(id: number, updateAssinaturaDto: UpdateAssinaturaDto) {
    return this.prisma.assinatura.update({
      where: { ID_Assinatura: id },
      data: updateAssinaturaDto,
    });
  }

  remove(id: number) {
    return this.prisma.assinatura.delete({ where: { ID_Assinatura: id } });
  }
}
