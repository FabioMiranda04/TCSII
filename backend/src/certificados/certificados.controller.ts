import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CertificadosService } from './certificados.service';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';

@ApiTags('certificados')
@Controller('certificados')
export class CertificadosController {
  constructor(private readonly certificadosService: CertificadosService) {}

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Emitir um certificado' })
  @ApiResponse({ status: 201, description: 'Certificado emitido com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createCertificadoDto: CreateCertificadoDto) {
    return this.certificadosService.create(createCertificadoDto);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Listar certificados (opcionalmente de um usuário)' })
  @ApiQuery({ name: 'ID_Usuario', required: false, type: Number })
  findAll(@Query('ID_Usuario', new ParseIntPipe({ optional: true })) ID_Usuario?: number) {
    return this.certificadosService.findAll(ID_Usuario);
  }

  // Rota pública: qualquer pessoa pode validar um certificado pelo código
  @Get('verificar/:codigo')
  @ApiOperation({ summary: 'Verificar um certificado pelo código de verificação' })
  verificar(@Param('codigo') codigo: string) {
    return this.certificadosService.findByCodigo(codigo);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: 'Buscar um certificado pelo ID' })
  findOne(@Param('id') id: string) {
    return this.certificadosService.findOne(+id);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um certificado' })
  update(@Param('id') id: string, @Body() updateCertificadoDto: UpdateCertificadoDto) {
    return this.certificadosService.update(+id, updateCertificadoDto);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um certificado' })
  remove(@Param('id') id: string) {
    return this.certificadosService.remove(+id);
  }
}
