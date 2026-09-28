import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TrilhasCursosService } from './trilhas-cursos.service';
import { CreateTrilhasCursoDto } from './dto/create-trilhas-curso.dto';
import { UpdateTrilhasCursoDto } from './dto/update-trilhas-curso.dto';

@ApiTags('trilhas-cursos')
@Controller('trilhas-cursos')
export class TrilhasCursosController {
  constructor(private readonly trilhasCursosService: TrilhasCursosService) {}

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Adicionar um curso a uma trilha' })
  @ApiResponse({ status: 201, description: 'Curso adicionado à trilha.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createTrilhasCursoDto: CreateTrilhasCursoDto) {
    return this.trilhasCursosService.create(createTrilhasCursoDto);
  }

  // Rota pública: catálogo
  @Get()
  @ApiOperation({ summary: 'Listar cursos das trilhas (opcionalmente de uma trilha), ordenados' })
  @ApiQuery({ name: 'ID_Trilha', required: false, type: Number })
  findAll(@Query('ID_Trilha', new ParseIntPipe({ optional: true })) ID_Trilha?: number) {
    return this.trilhasCursosService.findAll(ID_Trilha);
  }

  @Get(':idTrilha/:idCurso')
  @ApiOperation({ summary: 'Buscar a associação trilha/curso' })
  findOne(@Param('idTrilha') idTrilha: string, @Param('idCurso') idCurso: string) {
    return this.trilhasCursosService.findOne(+idTrilha, +idCurso);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Patch(':idTrilha/:idCurso')
  @ApiOperation({ summary: 'Atualizar a ordem de um curso na trilha' })
  update(
    @Param('idTrilha') idTrilha: string,
    @Param('idCurso') idCurso: string,
    @Body() updateTrilhasCursoDto: UpdateTrilhasCursoDto,
  ) {
    return this.trilhasCursosService.update(+idTrilha, +idCurso, updateTrilhasCursoDto);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Delete(':idTrilha/:idCurso')
  @ApiOperation({ summary: 'Remover um curso da trilha' })
  remove(@Param('idTrilha') idTrilha: string, @Param('idCurso') idCurso: string) {
    return this.trilhasCursosService.remove(+idTrilha, +idCurso);
  }
}
