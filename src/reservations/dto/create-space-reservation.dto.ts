import { ArrayMinSize, IsArray, IsDateString, IsOptional, IsString } from "class-validator";

export class CreateSpaceReservationDto {
  @IsString() spaceId: string;
  @IsDateString() date: string;
  @IsArray() @ArrayMinSize(1) timeBlocks: string[];
  @IsOptional() @IsString() notes?: string;
}
