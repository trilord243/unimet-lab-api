import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateReagentDto {
  @IsString()
  name: string;

  @IsOptional() @IsString() formula?: string;
  @IsOptional() @IsString() casNumber?: string;

  @IsNumber() @Min(0)
  quantity: number;

  @IsString()
  unit: string;

  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() hazardClass?: string;
  @IsOptional() @IsString() msdsLink?: string;
  @IsOptional() @IsNumber() @Min(0) lowStockThreshold?: number;
  @IsOptional() @IsString() notes?: string;
}
