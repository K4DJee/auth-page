import { IsBoolean, IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { Role } from "src/common/enums/role.enum";

export class ChangePageSettingsDto {
    @IsNumber()
    @IsNotEmpty()
    id: number

    @IsBoolean()
    @IsNotEmpty()
    isPublic: boolean

    @IsNumber()
    @IsNotEmpty()
    userId: number

    @IsEnum(Role)
    role: Role
}