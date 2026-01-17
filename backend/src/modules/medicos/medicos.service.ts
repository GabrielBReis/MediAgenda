import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';

@Injectable()
export class MedicosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMedicoDto) {
    const exists = await this.prisma.medico.findUnique({
      where: { crm: dto.crm },
    });
    if (exists) throw new ConflictException('CRM já cadastrado.');

    return this.prisma.medico.create({ data: dto });
  }

  async findAll() {
    return this.prisma.medico.findMany({ orderBy: { nome: 'asc' } });
  }

  async findOne(id: string) {
    const medico = await this.prisma.medico.findUnique({ where: { id } });
    if (!medico) throw new NotFoundException('Médico não encontrado.');
    return medico;
  }

  async update(id: string, dto: UpdateMedicoDto) {
    await this.findOne(id);

    if (dto.crm) {
      const exists = await this.prisma.medico.findUnique({
        where: { crm: dto.crm },
      });
      if (exists && exists.id !== id)
        throw new ConflictException('CRM já cadastrado.');
    }

    return this.prisma.medico.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.medico.delete({ where: { id } });
    return { ok: true };
  }
}
