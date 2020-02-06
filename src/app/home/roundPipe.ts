import { Pipe } from '@angular/core';

@Pipe({ name: 'round' })
export class RoundPipe {
    transform(input: number) {
        if (input == 0)
            return 0;
        else
            return Math.round(input);
    }
}