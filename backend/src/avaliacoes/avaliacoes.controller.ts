import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AvaliacoesService } from './avaliacoes.service';
import { CreateAvaliacoeDto } from './dto/create-avaliacoe.dto';
import { UpdateAvaliacoeDto } from './dto/update-avaliacoe.dto';

@ApiTags('avaliacoes')
@Controller('avaliacoes')
export class AvaliacoesController {
  constructor(private readonly avaliacoesService: AvaliacoesService) {}

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Avaliar um curso' })
  @ApiResponse({ status: 201, description: 'Avaliação criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createAvaliacoeDto: CreateAvaliacoeDto) {
    return this.avaliacoesService.create(createAvaliacoeDto);
  }

  // Rota pública: avaliações aparecem no catálogo
  @Get()
  @ApiOperation({ summary: 'Listar avaliações (opcionalmente de um curso)' })
  @ApiQuery({ name: 'ID_Curso', required: false, type: Number })
  findAll(@Query('ID_Curso', new ParseIntPipe({ optional: true })) ID_Curso?: number) {
    return this.avaliacoesService.findAll(ID_Curso);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma avaliação pelo ID' })
  findOne(@Param('id') id: string) {
    return this.avaliacoesService.findOne(+id);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma avaliação' })
  update(@Param('id') id: string, @Body() updateAvaliacoeDto: UpdateAvaliacoeDto) {
    return this.avaliacoesService.update(+id, updateAvaliacoeDto);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma avaliação' })
  remove(@Param('id') id: string) {
    return this.avaliacoesService.remove(+id);
  }
}
