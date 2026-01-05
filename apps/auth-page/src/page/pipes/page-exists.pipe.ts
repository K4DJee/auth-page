import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class PageExists implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
        
    }
}