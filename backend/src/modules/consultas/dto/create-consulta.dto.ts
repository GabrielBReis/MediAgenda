import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CreateConsultaDto {
  @IsString()
  @IsNotEmpty()
  medicoId: string;

  @IsString()
  @IsNotEmpty()
  paciente: string;

  @IsISO8601()
  @IsNotEmpty()
  dataHora: string;
}
