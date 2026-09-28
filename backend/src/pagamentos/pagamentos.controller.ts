import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PagamentosService } from './pagamentos.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';

// Todas as rotas protegidas: não há rota pública neste controller
@ApiTags('pagamentos')
@ApiBearerAuth('token')
@UseGuards(AuthGuard('jwt'))
@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar um pagamento' })
  @ApiResponse({ status: 201, description: 'Pagamento registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body() createPagamentoDto: CreatePagamentoDto) {
    return this.pagamentosService.create(createPagamentoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pagamentos (opcionalmente de uma assinatura)' })
  @ApiQuery({ name: 'ID_Assinatura', required: false, type: Number })
  findAll(@Query('ID_Assinatura', new ParseIntPipe({ optional: true })) ID_Assinatura?: number) {
    return this.pagamentosService.findAll(ID_Assinatura);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um pagamento pelo ID' })
  findOne(@Param('id') id: string) {
    return this.pagamentosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um pagamento' })
  update(@Param('id') id: string, @Body() updatePagamentoDto: UpdatePagamentoDto) {
    return this.pagamentosService.update(+id, updatePagamentoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um pagamento' })
  remove(@Param('id') id: string) {
    return this.pagamentosService.remove(+id);
  }
}
