import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';

@Injectable()
export class CertificadosService {
  constructor(private prisma: PrismaService) {}

  create(createCertificadoDto: CreateCertificadoDto) {
    // Gera um código de verificação único quando não é informado
    return this.prisma.certificado.create({
      data: {
        ...createCertificadoDto,
        CodigoVerificacao: createCertificadoDto.CodigoVerificacao ?? randomUUID(),
      },
    });
  }

  // Filtro opcional: certificados de um usuário
  findAll(ID_Usuario?: number) {
    return this.prisma.certificado.findMany({ where: { ID_Usuario } });
  }

  findOne(id: number) {
    return this.prisma.certificado.findUnique({ where: { ID_Certificado: id } });
  }

  // Verificação pública da autenticidade de um certificado
  findByCodigo(CodigoVerificacao: string) {
    return this.prisma.certificado.findUnique({ where: { CodigoVerificacao } });
  }

  update(id: number, updateCertificadoDto: UpdateCertificadoDto) {
    return this.prisma.certificado.update({
      where: { ID_Certificado: id },
      data: updateCertificadoDto,
    });
  }

  remove(id: number) {
    return this.prisma.certificado.delete({ where: { ID_Certificado: id } });
  }
}
