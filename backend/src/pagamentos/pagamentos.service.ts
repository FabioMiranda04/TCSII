import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';

@Injectable()
export class PagamentosService {
  constructor(private prisma: PrismaService) {}

  create(createPagamentoDto: CreatePagamentoDto) {
    return this.prisma.pagamento.create({ data: createPagamentoDto });
  }

  // Filtro opcional: pagamentos de uma assinatura
  findAll(ID_Assinatura?: number) {
    return this.prisma.pagamento.findMany({ where: { ID_Assinatura } });
  }

  findOne(id: number) {
    return this.prisma.pagamento.findUnique({ where: { ID_Pagamento: id } });
  }

  update(id: number, updatePagamentoDto: UpdatePagamentoDto) {
    return this.prisma.pagamento.update({
      where: { ID_Pagamento: id },
      data: updatePagamentoDto,
    });
  }

  remove(id: number) {
    return this.prisma.pagamento.delete({ where: { ID_Pagamento: id } });
  }
}
