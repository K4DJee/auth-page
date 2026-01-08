import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentBodyDto{
    @ApiProperty({description: "Текст комментария", example: "Вопрос: какое направление IT самое актуальное сейчас?"})
    @IsString()
    @IsNotEmpty()
    text: string
}