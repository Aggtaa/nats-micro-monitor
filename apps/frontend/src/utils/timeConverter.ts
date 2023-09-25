export const toMs = (time?: number): number => {
    if (!time) {
        return 0
    }

    return +(time / 1000).toFixed()
}

export const toDate = (time?: Date | string): string => {
    if (!time) {
        return ''
    }

    return new Date(time).toLocaleString()
}

export const padStart = (value: number | string, number: number = 2, symbol: string = '0') => {
    return `${value}`.padStart(number, symbol)
}

export const toLastSeen = (time?: Date | string): string => {
    if (!time) {
        return ''
    }

    const currentTime = Date.now() - +new Date(time)
    const hour = padStart(Math.floor(currentTime / (1000 * 60 * 60)))
    const remainingHour = currentTime % (1000 * 60 * 60)
    const minutes = padStart(Math.floor(remainingHour / (1000 * 60)))
    const remainingMinutes = (currentTime % (1000 * 60 * 60)) % (1000 * 60)
    const seconds = Math.floor(remainingMinutes / 1000)
    const secondsWithPad = padStart(seconds)

    if (hour != '00') {
        return `${hour}:${minutes}:${secondsWithPad}`
    }

    if (minutes != '00') {
        return `${minutes}:${secondsWithPad}`
    }

    return `${seconds}s`
}