import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '../generated/prisma/client';

// Converte erros conhecidos do Prisma em respostas amigáveis em vez de erro 500
const ERROS: Record<string, [number, string]> = {
  P2002: [HttpStatus.CONFLICT, 'Registro duplicado: já existe um registro com este valor único.'],
  P2003: [HttpStatus.BAD_REQUEST, 'Referência inválida: o registro relacionado não existe ou ainda está em uso.'],
  P2025: [HttpStatus.NOT_FOUND, 'Registro não encontrado.'],
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const [statusCode, message] = ERROS[exception.code] ?? [HttpStatus.INTERNAL_SERVER_ERROR, 'Erro interno no banco de dados.'];
    host.switchToHttp().getResponse<Response>().status(statusCode).json({ statusCode, message });
  }
}
