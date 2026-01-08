import { IsBoolean, IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { Role } from "../../../src/common/enums/role.enum";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePageSettingsDto {
    @ApiProperty({description: "ID страницы", example: "1"})
    @IsNumber()
    @IsNotEmpty()
    id: number

    @ApiProperty({description: "Тип страницы. true - публичная страница, false - приватная страница", example: "true"})
    @IsBoolean()
    @IsNotEmpty()
    isPublic: boolean

    @ApiProperty({description: "ID пользователя, который является создателем этой страницы", example: "1"})
    @IsNumber()
    @IsNotEmpty()
    userId: number

    @IsEnum(Role)
    role: Role
}