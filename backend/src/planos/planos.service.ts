import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';

@Injectable()
export class PlanosService {
  constructor(private prisma: PrismaService) {}

  create(createPlanoDto: CreatePlanoDto) {
    return this.prisma.plano.create({ data: createPlanoDto });
  }

  findAll() {
    return this.prisma.plano.findMany();
  }

  findOne(id: number) {
    return this.prisma.plano.findUnique({ where: { ID_Plano: id } });
  }

  update(id: number, updatePlanoDto: UpdatePlanoDto) {
    return this.prisma.plano.update({
      where: { ID_Plano: id },
      data: updatePlanoDto,
    });
  }

  remove(id: number) {
    return this.prisma.plano.delete({ where: { ID_Plano: id } });
  }
}
