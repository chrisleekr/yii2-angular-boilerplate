import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'nl2br'
})
export class Nl2BrPipe {
    transform(value: string, args: string) : string {
        if (value !== void 0) {
            return value.replace(/\n/g, '<br>');
        }
        return value;
    }
}