import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CratePageWithUserId{
  @IsString()
  @IsNotEmpty()
  name:string

  @IsNumber()
  @IsNotEmpty()
  userId: number

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean
}