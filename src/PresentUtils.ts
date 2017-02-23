export function throwIfAbsent(value: any, name: string, error?: string | Error) {
    if (!isPresent(value)) {
        throw error ? error : new Error(`Error: ${name} was not given.`);
    }
}

export function isPresent(value: any) {
    return value !== undefined && value !== null;
}
