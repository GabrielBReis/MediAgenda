import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';

@Injectable()
export class ConsultasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateConsultaDto) {
    const data = new Date(dto.dataHora);
    if (Number.isNaN(data.getTime()))
      throw new BadRequestException('dataHora inválida.');

    if (data.getTime() < Date.now()) {
      throw new BadRequestException(
        'Não é permitido agendar consultas no passado.',
      );
    }

    const medico = await this.prisma.medico.findUnique({
      where: { id: dto.medicoId },
    });
    if (!medico) throw new NotFoundException('Médico não encontrado.');

    const conflito = await this.prisma.consulta.findUnique({
      where: { medicoId_dataHora: { medicoId: dto.medicoId, dataHora: data } },
    });
    if (conflito)
      throw new ConflictException(
        'Já existe consulta para este médico nesse horário.',
      );

    return this.prisma.consulta.create({
      data: { medicoId: dto.medicoId, paciente: dto.paciente, dataHora: data },
    });
  }
}
