import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProgressoAulasService } from './progresso-aulas.service';
import { CreateProgressoAulaDto } from './dto/create-progresso-aula.dto';
import { UpdateProgressoAulaDto } from './dto/update-progresso-aula.dto';

// Todas as rotas protegidas: não há rota pública neste controller
@ApiTags('progresso-aulas')
@ApiBearerAuth('token')
@UseGuards(AuthGuard('jwt'))
@Controller('progresso-aulas')
export class ProgressoAulasController {
  constructor(private readonly progressoAulasService: ProgressoAulasService) {}

  @Post()
  @ApiOperation({ summary: 'Marcar uma aula como concluída' })
  @ApiResponse({ status: 201, description: 'Progresso registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createProgressoAulaDto: CreateProgressoAulaDto) {
    return this.progressoAulasService.create(createProgressoAulaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar progresso (opcionalmente de um usuário)' })
  @ApiQuery({ name: 'ID_Usuario', required: false, type: Number })
  findAll(@Query('ID_Usuario', new ParseIntPipe({ optional: true })) ID_Usuario?: number) {
    return this.progressoAulasService.findAll(ID_Usuario);
  }

  @Get(':idUsuario/:idAula')
  @ApiOperation({ summary: 'Buscar o progresso de um usuário em uma aula' })
  findOne(@Param('idUsuario') idUsuario: string, @Param('idAula') idAula: string) {
    return this.progressoAulasService.findOne(+idUsuario, +idAula);
  }

  @Patch(':idUsuario/:idAula')
  @ApiOperation({ summary: 'Atualizar o status de uma aula' })
  update(
    @Param('idUsuario') idUsuario: string,
    @Param('idAula') idAula: string,
    @Body() updateProgressoAulaDto: UpdateProgressoAulaDto,
  ) {
    return this.progressoAulasService.update(+idUsuario, +idAula, updateProgressoAulaDto);
  }

  @Delete(':idUsuario/:idAula')
  @ApiOperation({ summary: 'Desmarcar uma aula concluída' })
  remove(@Param('idUsuario') idUsuario: string, @Param('idAula') idAula: string) {
    return this.progressoAulasService.remove(+idUsuario, +idAula);
  }
}
