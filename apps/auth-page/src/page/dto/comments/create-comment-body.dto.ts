import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentBodyDto{
    @IsString()
    @IsNotEmpty()
    text: string
}