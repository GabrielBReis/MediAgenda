import { Body, Controller, Get, Post } from '@nestjs/common';
import { MedicosService } from './medicos.service';
import { CreateMedicoDto } from './dto/create-medico.dto';

@Controller('medicos')
export class MedicosController {
  constructor(private readonly service: MedicosService) {}

  @Post()
  create(@Body() dto: CreateMedicoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
