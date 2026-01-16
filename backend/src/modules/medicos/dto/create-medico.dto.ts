import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMedicoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  crm: string;

  @IsString()
  @IsNotEmpty()
  especialidade: string;
}
