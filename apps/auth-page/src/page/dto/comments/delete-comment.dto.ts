import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class DeleteCommentDto{
    @IsNumber()
    @IsNotEmpty()
    id: number

    @IsNumber()
    @IsNotEmpty()
    pageId: number

    @IsNumber()
    @IsNotEmpty()
    userId: number
}