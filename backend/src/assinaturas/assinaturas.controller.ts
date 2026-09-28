import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AssinaturasService } from './assinaturas.service';
import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';

// Todas as rotas protegidas: não há rota pública neste controller
@ApiTags('assinaturas')
@ApiBearerAuth('token')
@UseGuards(AuthGuard('jwt'))
@Controller('assinaturas')
export class AssinaturasController {
  constructor(private readonly assinaturasService: AssinaturasService) {}

  @Post()
  @ApiOperation({ summary: 'Assinar um plano' })
  @ApiResponse({ status: 201, description: 'Assinatura criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createAssinaturaDto: CreateAssinaturaDto) {
    return this.assinaturasService.create(createAssinaturaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar assinaturas (opcionalmente de um usuário)' })
  @ApiQuery({ name: 'ID_Usuario', required: false, type: Number })
  findAll(@Query('ID_Usuario', new ParseIntPipe({ optional: true })) ID_Usuario?: number) {
    return this.assinaturasService.findAll(ID_Usuario);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma assinatura pelo ID' })
  findOne(@Param('id') id: string) {
    return this.assinaturasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma assinatura' })
  update(@Param('id') id: string, @Body() updateAssinaturaDto: UpdateAssinaturaDto) {
    return this.assinaturasService.update(+id, updateAssinaturaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar uma assinatura' })
  remove(@Param('id') id: string) {
    return this.assinaturasService.remove(+id);
  }
}
