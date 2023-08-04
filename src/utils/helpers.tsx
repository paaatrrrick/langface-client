
const trimStringToChars = (str: string, N: number): string => {
    if (str.length > N) {
        return str.substring(0, N - 3) + "...";
    } else {
        return str;
    }
}

export { trimStringToChars };
