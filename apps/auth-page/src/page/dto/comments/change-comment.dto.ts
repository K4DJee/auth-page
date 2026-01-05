import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class ChangeCommentDto{
    @IsNumber()
    @IsNotEmpty()
    id: number

    @IsNumber()
    @IsNotEmpty()
    pageId: number

    @IsNumber()
    @IsNotEmpty()
    userId: number

    @IsString()
    @IsNotEmpty()
    text: string
}