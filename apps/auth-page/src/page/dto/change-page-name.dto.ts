import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChangePageNameDto{
    @IsNumber()
    @IsNotEmpty()
    id: number

    @IsString()
    @IsNotEmpty()
    name:string

    @IsNumber()
    @IsNotEmpty()
    userId: number


}