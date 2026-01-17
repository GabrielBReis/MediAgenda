import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';

@Injectable()
export class ConsultasService {
  constructor(private readonly prisma: PrismaService) {}

  private parseDateOrThrow(value: string) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime()))
      throw new BadRequestException('dataHora inválida.');
    return d;
  }

  private ensureNotPast(date: Date) {
    if (date.getTime() < Date.now()) {
      throw new BadRequestException(
        'Não é permitido agendar consultas no passado.',
      );
    }
  }

  async create(dto: CreateConsultaDto) {
    const dataHora = this.parseDateOrThrow(dto.dataHora);
    this.ensureNotPast(dataHora);

    const medico = await this.prisma.medico.findUnique({
      where: { id: dto.medicoId },
    });
    if (!medico) throw new NotFoundException('Médico não encontrado.');

    const conflito = await this.prisma.consulta.findUnique({
      where: { medicoId_dataHora: { medicoId: dto.medicoId, dataHora } },
    });
    if (conflito)
      throw new ConflictException(
        'Já existe consulta para este médico nesse horário.',
      );

    return this.prisma.consulta.create({
      data: { medicoId: dto.medicoId, paciente: dto.paciente, dataHora },
    });
  }

  async findAll() {
    return this.prisma.consulta.findMany({
      include: { medico: true },
      orderBy: { dataHora: 'asc' },
    });
  }

  async findOne(id: string) {
    const consulta = await this.prisma.consulta.findUnique({
      where: { id },
      include: { medico: true },
    });
    if (!consulta) throw new NotFoundException('Consulta não encontrada.');
    return consulta;
  }

  async update(id: string, dto: UpdateConsultaDto) {
    const existing = await this.prisma.consulta.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Consulta não encontrada.');

    const dataHora = dto.dataHora
      ? this.parseDateOrThrow(dto.dataHora)
      : existing.dataHora;
    this.ensureNotPast(dataHora);

    // se mudar dataHora, checar conflito com mesmo medico
    if (dto.dataHora) {
      const conflito = await this.prisma.consulta.findUnique({
        where: { medicoId_dataHora: { medicoId: existing.medicoId, dataHora } },
      });

      if (conflito && conflito.id !== id) {
        throw new ConflictException(
          'Já existe consulta para este médico nesse horário.',
        );
      }
    }

    return this.prisma.consulta.update({
      where: { id },
      data: {
        paciente: dto.paciente ?? existing.paciente,
        dataHora,
      },
      include: { medico: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.consulta.delete({ where: { id } });
    return { ok: true };
  }
}
