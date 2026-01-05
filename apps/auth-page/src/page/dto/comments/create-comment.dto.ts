import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCommentDto{
    @IsString()
    @IsNotEmpty()
    text: string

    @IsNumber()
    @IsNotEmpty()
    pageId: number
    
    @IsNumber()
    @IsNotEmpty()
    userId: number
}