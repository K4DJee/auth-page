import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreatePageDto{
  @ApiProperty({description: "Название страницы", example: "BOOM!"})
  @IsString()
  @IsNotEmpty()
  name:string

  @ApiProperty({description: "Тип страницы. true - публичная страница, false - приватная страница", example: "true"})
  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean
}