import { FormatTimePipe } from './format-time.pipe';

describe('FormatTimePipe', () => {
    let pipe: FormatTimePipe;

    beforeEach(() => {
        pipe = new FormatTimePipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should transform seconds into minutes:seconds format', () => {
        expect(pipe.transform(0)).toBe('00:00');
        expect(pipe.transform(59)).toBe('00:59');
        expect(pipe.transform(60)).toBe('01:00');
        expect(pipe.transform(3600)).toBe('60:00');
        expect(pipe.transform(3661)).toBe('61:01');
    });

    it('should handle single digit minutes and seconds', () => {
        expect(pipe.transform(5)).toBe('00:05');
        expect(pipe.transform(65)).toBe('01:05');
    });

    it('should handle null input', () => {
        expect(pipe.transform(null)).toBe('');
    });
});
