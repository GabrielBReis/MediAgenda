import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MedicosController } from './medicos.controller';
import { MedicosService } from './medicos.service';

@Module({
  imports: [PrismaModule],
  controllers: [MedicosController],
  providers: [MedicosService],
})
export class MedicosModule {}
