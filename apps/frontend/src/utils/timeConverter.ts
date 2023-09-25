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