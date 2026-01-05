import { IsNotEmpty, IsString } from "class-validator";

export class ChangePageNameDto1{
    @IsString()
    @IsNotEmpty()
    name: string
}