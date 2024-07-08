import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {
    transform(seconds: number | null): string {
        if (seconds === null) return '';

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

        return `${formattedMinutes}:${formattedSeconds}`;
    }
}
