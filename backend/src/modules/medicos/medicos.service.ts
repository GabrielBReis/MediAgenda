import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMedicoDto } from './dto/create-medico.dto';

@Injectable()
export class MedicosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMedicoDto) {
    const existing = await this.prisma.medico.findUnique({
      where: { crm: dto.crm },
    });
    if (existing) throw new ConflictException('CRM já cadastrado.');
    return this.prisma.medico.create({ data: dto });
  }

  async findAll() {
    return this.prisma.medico.findMany({ orderBy: { nome: 'asc' } });
  }
}
