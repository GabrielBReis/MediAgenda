import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ConsultasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateConsultaDto) {
    const data = new Date(dto.dataHora);

    if (Number.isNaN(data.getTime())) {
      throw new BadRequestException('dataHora inválida.');
    }

    if (data.getTime() < Date.now()) {
      throw new BadRequestException(
        'Não é permitido agendar consultas no passado.',
      );
    }

    const medico = await this.prisma.medico.findUnique({
      where: { id: dto.medicoId },
    });

    if (!medico) {
      throw new NotFoundException('Médico não encontrado.');
    }

    // Checagem amigável antes de inserir
    const conflito = await this.prisma.consulta.findUnique({
      where: {
        medicoId_dataHora: {
          medicoId: dto.medicoId,
          dataHora: data,
        },
      },
    });

    if (conflito) {
      throw new ConflictException(
        'Já existe consulta para este médico nesse horário.',
      );
    }

    // Blindagem contra concorrência (race condition)
    try {
      return await this.prisma.consulta.create({
        data: {
          medicoId: dto.medicoId,
          paciente: dto.paciente,
          dataHora: data,
        },
      });
    } catch (err: unknown) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException(
          'Já existe consulta para este médico nesse horário.',
        );
      }
      throw err;
    }
  }

  async findAll() {
    return this.prisma.consulta.findMany({
      include: { medico: true },
    });
  }
}
