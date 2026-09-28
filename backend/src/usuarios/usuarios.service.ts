import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt'; // Biblioteca para hash de senha

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    // Gera um salt e cria o hash da senha enviada pelo DTO
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUsuarioDto.SenhaHash, salt);

    // Salva o usuário no banco com a senha criptografada
    return this.prisma.usuario.create({
      data: { ...createUsuarioDto, SenhaHash: hash },
    });
  }

  // Método essencial para buscar usuário pelo e-mail durante o login
  async findByEmail(Email: string) {
    return this.prisma.usuario.findUnique({
      where: { Email },
      omit: { SenhaHash: false }, // o login precisa do hash para comparar
    });
  }

  findAll() {
    return this.prisma.usuario.findMany();
  }

  findOne(id: number) {
    return this.prisma.usuario.findUnique({ where: { ID_Usuario: id } });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    // Se a senha for alterada, salva o novo hash
    if (updateUsuarioDto.SenhaHash) {
      const salt = await bcrypt.genSalt();
      updateUsuarioDto.SenhaHash = await bcrypt.hash(updateUsuarioDto.SenhaHash, salt);
    }
    return this.prisma.usuario.update({
      where: { ID_Usuario: id },
      data: updateUsuarioDto,
    });
  }

  remove(id: number) {
    return this.prisma.usuario.delete({ where: { ID_Usuario: id } });
  }
}
