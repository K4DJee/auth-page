import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreatePageDto{
  @IsString()
  @IsNotEmpty()
  name:string

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean
}