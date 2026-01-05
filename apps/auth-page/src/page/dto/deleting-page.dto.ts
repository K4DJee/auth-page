import { IsNotEmpty, IsNumber } from "class-validator"

export class DeletingPageDto{
    @IsNumber()
    @IsNotEmpty()
    id: number

    @IsNumber()
    @IsNotEmpty()
    userId: number
}