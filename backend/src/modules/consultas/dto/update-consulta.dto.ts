import { IsISO8601, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateConsultaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  paciente?: string;

  @IsOptional()
  @IsISO8601()
  dataHora?: string;
}
