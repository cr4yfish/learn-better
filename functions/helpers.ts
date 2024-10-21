/**
 * Swap strings with Date objects in data
 * @param data | data[]
 * @returns data with Date object(s)
 */
export function fixDateFormat<T extends { created_at?: Date | string }>(data: T | T[]): T | T[] {
    // check if array or object
    if (Array.isArray(data)) {
        data.forEach((item) => {
            if (item.created_at) {
                item.created_at = new Date(item.created_at);
            }
        });
    } else {
        if (data.created_at) {
            data.created_at = new Date(data.created_at);
        }
    }
    return data;
}

export function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}

export function formatSeconds(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}


export function getDayBefore(date: Date): Date {
    const previousDay = new Date(date);
    previousDay.setDate(date.getDate() - 1);
    return previousDay;
}

/**
 * Returns fortnite of date
 * @param date | Date
 * @returns Date
 */
export function fortnite(date: Date): Date {
    const fortnite = new Date(date);
    fortnite.setDate(date.getDate() + 2);
    return fortnite;
}


// Fisher-Yates (Knuth) Shuffle algorithm
export function shuffleArray<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
