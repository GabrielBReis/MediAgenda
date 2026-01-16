import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConsultasController } from './consultas.controller';
import { ConsultasService } from './consultas.service';

@Module({
  imports: [PrismaModule],
  controllers: [ConsultasController],
  providers: [ConsultasService],
})
export class ConsultasModule {}
