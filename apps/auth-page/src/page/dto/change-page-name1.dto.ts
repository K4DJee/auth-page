import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ChangePageNameDto1{
    @ApiProperty({description: "Новое название страницы", example: "Nature is so beautiful"})
    @IsString()
    @IsNotEmpty()
    name: string
}