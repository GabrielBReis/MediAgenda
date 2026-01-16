import { Test, TestingModule } from '@nestjs/testing';
import { ConsultasService } from './consultas.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ConsultasService', () => {
  let service: ConsultasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultasService,
        { provide: PrismaService, useValue: {} }, // mock simples
      ],
    }).compile();

    service = module.get(ConsultasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
