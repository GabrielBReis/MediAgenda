import { Test, TestingModule } from '@nestjs/testing';
import { ConsultasController } from './consultas.controller';
import { ConsultasService } from './consultas.service';

describe('ConsultasController', () => {
  let controller: ConsultasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultasController],
      providers: [{ provide: ConsultasService, useValue: {} }],
    }).compile();

    controller = module.get(ConsultasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
