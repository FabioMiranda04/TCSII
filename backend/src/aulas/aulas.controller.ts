import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AulasService } from './aulas.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

@ApiTags('aulas')
@Controller('aulas')
export class AulasController {
  constructor(private readonly aulasService: AulasService) {}

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Adicionar uma aula a um módulo' })
  @ApiResponse({ status: 201, description: 'Aula criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createAulaDto: CreateAulaDto) {
    return this.aulasService.create(createAulaDto);
  }

  // Rota pública: catálogo
  @Get()
  @ApiOperation({ summary: 'Listar aulas (opcionalmente de um módulo), ordenadas' })
  @ApiQuery({ name: 'ID_Modulo', required: false, type: Number })
  findAll(@Query('ID_Modulo', new ParseIntPipe({ optional: true })) ID_Modulo?: number) {
    return this.aulasService.findAll(ID_Modulo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma aula pelo ID' })
  findOne(@Param('id') id: string) {
    return this.aulasService.findOne(+id);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma aula' })
  update(@Param('id') id: string, @Body() updateAulaDto: UpdateAulaDto) {
    return this.aulasService.update(+id, updateAulaDto);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma aula' })
  remove(@Param('id') id: string) {
    return this.aulasService.remove(+id);
  }
}
