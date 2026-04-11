import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateReagentRequestDto {
  @IsString() reagentId: string;
  @IsNumber() @Min(0.01) quantity: number;
  @IsString() unit: string;
  @IsOptional() @IsString() justification?: string;
}
