export let originUsers;
export async function getArrayOfData(url) {
    let data = await getData(url, {});
    let identifiers = Object.keys(data);

    let arrayData = identifiers.map(identifier => {
        data[identifier].id = identifier;
        return data[identifier];
    });

    originUsers = arrayData;
    return arrayData;
}

async function getData(url, options) {
    const response = await fetch(url, options);
    const resJson = await response.json();
    return resJson.data;
}

export async function saveData(url, data) {
    let options = {
        method: "POST",
        body: JSON.stringify(data),
    };
    await fetch(url, options);
}

export async function deleteData(url, id) {
    let urldel = `${url}/${id}`;
    await fetch(urldel, { method: "Delete" });

    return await getArrayOfData(url);
}
