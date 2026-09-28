import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PlanosService } from './planos.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';

@ApiTags('planos')
@Controller('planos')
export class PlanosController {
  constructor(private readonly planosService: PlanosService) {}

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Criar um novo plano' })
  @ApiResponse({ status: 201, description: 'Plano criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createPlanoDto: CreatePlanoDto) {
    return this.planosService.create(createPlanoDto);
  }

  // Rota pública: vitrine de planos
  @Get()
  @ApiOperation({ summary: 'Listar todos os planos' })
  findAll() {
    return this.planosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um plano pelo ID' })
  findOne(@Param('id') id: string) {
    return this.planosService.findOne(+id);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um plano' })
  update(@Param('id') id: string, @Body() updatePlanoDto: UpdatePlanoDto) {
    return this.planosService.update(+id, updatePlanoDto);
  }

  @ApiBearerAuth('token')
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um plano' })
  remove(@Param('id') id: string) {
    return this.planosService.remove(+id);
  }
}
