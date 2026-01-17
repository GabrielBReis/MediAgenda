import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateMedicoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nome?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  crm?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  especialidade?: string;
}
