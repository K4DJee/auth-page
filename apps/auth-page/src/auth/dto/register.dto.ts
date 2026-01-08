import { ApiProperty } from "@nestjs/swagger"
import { Role } from "@prisma/client"
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"

export class registerDto {
    @ApiProperty({description: "Имя пользователя", example: "Иван", type: String})
    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    firstName: string

    @ApiProperty({description: "Фамилия пользователя", example: "Иванов", type: String})
    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    lastName: string

    @ApiProperty({description: "Электронная почта пользователя", example: "example@gmail.com", type: String})
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({description: "Пароль", example: "21312321SADA-1fasda", type: String})
    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string

    // @ApiProperty({description: "Роль пользователя", example: "USER", type: String})
    @IsEnum(Role)
    @IsOptional()
    @IsNotEmpty()
    role? : Role = Role.USER
}