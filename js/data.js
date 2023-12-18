/** A class containing methods for working with data:
 * getArrayOfData, saveData, deleteData.
 */
export class Data {
    constructor(url) {
        this.url = url;
        /* data contained in the url link */
        this.originUsers;

        /* Get an array of data with identifiers */
        this.getArrayOfData = async (url) => {
            let data = await getData(url, {});
            let identifiers = Object.keys(data);

            let arrayData = identifiers.map((identifier, i) => {
                data[identifier].id = identifier;
                return data[identifier];
            });

            this.originUsers = arrayData;
            return arrayData;
        };

        /* Get data in the format json */
        async function getData(url, options) {
            const response = await fetch(url, options);

            const resJson = await response.json();
            return resJson.data;
        }

        /* Save data by url link and returns the result of saving true or false */
        this.saveData = async function save(url, data) {
            let options = {
                method: "POST",
                body: JSON.stringify(data),
            };
            return (await fetch(url, options)).ok;
        };

        /* Delete data by url link */
        this.deleteData = async (url, id) => {
            let urldel = `${url}/${id}`;
            await fetch(urldel, { method: "Delete" });

            return await this.getArrayOfData(url);
        };
    }
}