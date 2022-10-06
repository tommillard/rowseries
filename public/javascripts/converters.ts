export function convertTimeStringToTenths(
    timeString: string
): number | undefined {
    // 13:12.9
    // 1:13:12.9
    // 5
    // :30
    // 8.5
    let splitString = timeString.split(":");

    splitString = splitString.filter((item) => item.length);

    if (splitString.length === 3) {
        return (
            parseInt(splitString[0]) * 60 * 60 * 10 +
            parseInt(splitString[1]) * 60 * 10 +
            parseFloat(splitString[2]) * 10
        );
    } else if (splitString.length === 2) {
        return (
            parseInt(splitString[0]) * 60 * 10 +
            parseFloat(splitString[1].slice(0, 2)) * 10
        );
    } else if (splitString.length === 1) {
        return parseFloat(splitString[0]) * 60 * 10;
    }

    return undefined;
}
