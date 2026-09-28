import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TrilhasService } from './trilhas.service';
import { CreateTrilhaDto } from './dto/create-trilha.dto';
import { UpdateTrilhaDto } from './dto/update-trilha.dto';

@ApiTags('trilhas')
@Controller('trilhas')
export class TrilhasController {
  constructor(private readonly trilhasService: TrilhasService) {}

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Criar uma nova trilha' })
  @ApiResponse({ status: 201, description: 'Trilha criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createTrilhaDto: CreateTrilhaDto) {
    return this.trilhasService.create(createTrilhaDto);
  }

  // Rota pública: catálogo
  @Get()
  @ApiOperation({ summary: 'Listar trilhas (opcionalmente de uma categoria)' })
  @ApiQuery({ name: 'ID_Categoria', required: false, type: Number })
  findAll(@Query('ID_Categoria', new ParseIntPipe({ optional: true })) ID_Categoria?: number) {
    return this.trilhasService.findAll(ID_Categoria);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma trilha pelo ID' })
  findOne(@Param('id') id: string) {
    return this.trilhasService.findOne(+id);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma trilha' })
  update(@Param('id') id: string, @Body() updateTrilhaDto: UpdateTrilhaDto) {
    return this.trilhasService.update(+id, updateTrilhaDto);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma trilha' })
  remove(@Param('id') id: string) {
    return this.trilhasService.remove(+id);
  }
}
