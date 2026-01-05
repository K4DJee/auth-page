import { IsBoolean, IsNotEmpty } from "class-validator";

export class ChangePageSettingsDto1{
    @IsBoolean({message:"IsPublic должен быть типа данных boolean"})
    @IsNotEmpty()
    isPublic: boolean
}