import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MatriculasService } from './matriculas.service';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';

// Todas as rotas protegidas: não há rota pública neste controller
@ApiTags('matriculas')
@ApiBearerAuth('token')
@UseGuards(AuthGuard('jwt'))
@Controller('matriculas')
export class MatriculasController {
  constructor(private readonly matriculasService: MatriculasService) {}

  @Post()
  @ApiOperation({ summary: 'Matricular um usuário em um curso' })
  @ApiResponse({ status: 201, description: 'Matrícula criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createMatriculaDto: CreateMatriculaDto) {
    return this.matriculasService.create(createMatriculaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar matrículas (opcionalmente de um usuário)' })
  @ApiQuery({ name: 'ID_Usuario', required: false, type: Number })
  findAll(@Query('ID_Usuario', new ParseIntPipe({ optional: true })) ID_Usuario?: number) {
    return this.matriculasService.findAll(ID_Usuario);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma matrícula pelo ID' })
  findOne(@Param('id') id: string) {
    return this.matriculasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma matrícula (ex: registrar DataConclusao)' })
  update(@Param('id') id: string, @Body() updateMatriculaDto: UpdateMatriculaDto) {
    return this.matriculasService.update(+id, updateMatriculaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar uma matrícula' })
  remove(@Param('id') id: string) {
    return this.matriculasService.remove(+id);
  }
}
