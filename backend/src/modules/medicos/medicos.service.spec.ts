import { Test, TestingModule } from '@nestjs/testing';
import { MedicosService } from './medicos.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('MedicosService', () => {
  let service: MedicosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicosService,
        { provide: PrismaService, useValue: {} }, // mock simples
      ],
    }).compile();

    service = module.get(MedicosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
