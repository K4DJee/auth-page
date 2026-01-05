import { Role } from "@prisma/client"
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"

export class registerDto {
    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    firstName: string


    @IsString()
    @MinLength(2)
    @IsNotEmpty()
    lastName: string


    @IsEmail()
    @IsNotEmpty()
    email: string


    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string

    
    @IsEnum(Role)
    @IsOptional()
    @IsNotEmpty()
    role? : Role = Role.USER
}