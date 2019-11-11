export function formatNumber(number: any) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function generationBlankItems(totalPages: number, pageSize: number, totalItems: number, properties: string[]) {
    const blankItems = [];
    const maxLength = totalPages * pageSize;

    if (maxLength === totalItems || totalItems === 0) { return blankItems; }

    for (let i = 0; i < maxLength - totalItems; i++) {
        let tempItem = {};
        properties.forEach(property => {
            tempItem[property] = '';
        });
        blankItems.push(tempItem);
    }

    return blankItems;
}

export function formatHeaderName(name: string) {
    let headerName = `` + name.charAt(0).toUpperCase();
    for (let i = 1; i < name.length; i++) {
        if (name[i] === name[i].toUpperCase()) {
            headerName = headerName + ' ' + name[i];
        } else {
            headerName = headerName + name[i];
        }
    }

    return headerName;
}
