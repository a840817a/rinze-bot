export function toJson<T>(csv: string) {
    const [firstLine, ...lines] = csv.split('\n');
    const keys = firstLine.split(',');
    return lines.map(line => ((values) =>
            keys.reduce(
                (curr, next, index) => ({
                    ...curr,
                    [next]: values[index],
                }),
                {}
            ) as T
    )(line.split(',')));
}