import { Body, Controller, Post } from '@nestjs/common';
import { ConsultasService } from './consultas.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';

@Controller('consultas')
export class ConsultasController {
  constructor(private readonly service: ConsultasService) {}

  @Post()
  create(@Body() dto: CreateConsultaDto) {
    return this.service.create(dto);
  }
}
