import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ModulosService } from './modulos.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';

@ApiTags('modulos')
@Controller('modulos')
export class ModulosController {
  constructor(private readonly modulosService: ModulosService) {}

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Adicionar um módulo a um curso' })
  @ApiResponse({ status: 201, description: 'Módulo criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createModuloDto: CreateModuloDto) {
    return this.modulosService.create(createModuloDto);
  }

  // Rota pública: catálogo
  @Get()
  @ApiOperation({ summary: 'Listar módulos (opcionalmente de um curso), ordenados' })
  @ApiQuery({ name: 'ID_Curso', required: false, type: Number })
  findAll(@Query('ID_Curso', new ParseIntPipe({ optional: true })) ID_Curso?: number) {
    return this.modulosService.findAll(ID_Curso);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um módulo pelo ID' })
  findOne(@Param('id') id: string) {
    return this.modulosService.findOne(+id);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um módulo' })
  update(@Param('id') id: string, @Body() updateModuloDto: UpdateModuloDto) {
    return this.modulosService.update(+id, updateModuloDto);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um módulo' })
  remove(@Param('id') id: string) {
    return this.modulosService.remove(+id);
  }
}
