export function groupBy(array: Record<string, any>[], by: string): Record<string, Record<string, any>> {
    if (!array.every(item => typeof(item[by]) === "string")) {
        throw new Error("Can't group by since not all items have the member as a String");
    }
    const groupedArray = {};
    array.forEach((item) => {
        const value = item[by];
        let groupedItems = groupedArray[value];
        if (!groupedItems) {
            groupedItems = [];
            groupedArray[value] = groupedItems;
        }
        groupedItems.push(item);
    });
    return groupedArray;
}