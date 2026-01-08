import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";

export class ChangePageSettingsDto1{
    @ApiProperty({description: "Тип страницы. true - публичная страница, false - приватная страница", example: "true"})
    @IsBoolean({message:"IsPublic должен быть типа данных boolean"})
    @IsNotEmpty()
    isPublic: boolean
}