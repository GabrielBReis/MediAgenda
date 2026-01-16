import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MedicosModule } from './modules/medicos/medicos.module';
import { ConsultasModule } from './modules/consultas/consultas.module';

@Module({
  imports: [PrismaModule, MedicosModule, ConsultasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
