import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConsultasService } from './consultas.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';

type Medico = { id: string; nome: string; crm: string; especialidade: string };
type Consulta = {
  id: string;
  medicoId: string;
  paciente: string;
  dataHora: Date;
};
type ConsultaComMedico = Consulta & { medico: Medico };

type PrismaMock = {
  medico: {
    findUnique: jest.Mock<Promise<Medico | null>, [{ where: { id: string } }]>;
  };
  consulta: {
    findUnique: jest.Mock<
      Promise<Consulta | null>,
      [{ where: { medicoId_dataHora: { medicoId: string; dataHora: Date } } }]
    >;
    create: jest.Mock<
      Promise<Consulta>,
      [{ data: { medicoId: string; paciente: string; dataHora: Date } }]
    >;
    findMany: jest.Mock<
      Promise<ConsultaComMedico[]>,
      [{ include: { medico: true } }]
    >;
  };
};

describe('ConsultasService', () => {
  let service: ConsultasService;

  const prismaMock: PrismaMock = {
    medico: {
      findUnique: jest.fn<
        Promise<Medico | null>,
        [{ where: { id: string } }]
      >(),
    },
    consulta: {
      findUnique: jest.fn<
        Promise<Consulta | null>,
        [{ where: { medicoId_dataHora: { medicoId: string; dataHora: Date } } }]
      >(),
      create: jest.fn<
        Promise<Consulta>,
        [{ data: { medicoId: string; paciente: string; dataHora: Date } }]
      >(),
      findMany: jest.fn<
        Promise<ConsultaComMedico[]>,
        [{ include: { medico: true } }]
      >(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultasService,
        {
          provide: PrismaService,
          useValue: prismaMock as unknown as PrismaService,
        },
      ],
    }).compile();

    service = module.get(ConsultasService);
    jest.clearAllMocks();
  });

  it('cria consulta (happy path)', async () => {
    prismaMock.medico.findUnique.mockResolvedValue({
      id: 'medico-1',
      nome: 'Ana',
      crm: '123',
      especialidade: 'Clinico',
    });

    prismaMock.consulta.findUnique.mockResolvedValue(null);

    prismaMock.consulta.create.mockResolvedValue({
      id: 'consulta-1',
      medicoId: 'medico-1',
      paciente: 'Joao',
      dataHora: new Date('2026-02-01T10:00:00.000Z'),
    });

    const dto: CreateConsultaDto = {
      medicoId: 'medico-1',
      paciente: 'Joao',
      dataHora: '2026-02-01T10:00:00.000Z',
    };

    const result = await service.create(dto);

    expect(prismaMock.consulta.create).toHaveBeenCalledTimes(1);
    expect(result.id).toBe('consulta-1');
  });

  it('lança ConflictException quando já existe consulta no horário', async () => {
    prismaMock.medico.findUnique.mockResolvedValue({
      id: 'medico-1',
      nome: 'Ana',
      crm: '123',
      especialidade: 'Clinico',
    });

    prismaMock.consulta.findUnique.mockResolvedValue({
      id: 'consulta-1',
      medicoId: 'medico-1',
      paciente: 'Joao',
      dataHora: new Date('2026-02-01T10:00:00.000Z'),
    });

    const dto: CreateConsultaDto = {
      medicoId: 'medico-1',
      paciente: 'Joao',
      dataHora: '2026-02-01T10:00:00.000Z',
    };

    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
  });
});
