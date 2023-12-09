export class Data {
    
    constructor(url) {
        this.url=url;
        this.originUsers;
        this.kaysAndTypes;

        this.getArrayOfData= async (url) => {
         
            let data = await getData(url, {method: "GET"});
            let identifiers = Object.keys( data);
        
            for (let i in identifiers) {
                if ( data[i]) {
                    this.kaysAndTypes = Object.entries( data[i]).reduce((map, e) => {
                        map[e[0]] = typeof e[1];
                        return map;
                    }, {});
                    break;
                }
            }

            let arrayData = identifiers.map((identifier, i) => {
                data[identifier].id = identifier;
                return data[identifier];
            });

            this.originUsers = arrayData;
            return arrayData;
        };

        async function getData(url, options){
            const response = await fetch(url, options);
            const resJson = await response.json();
            return  resJson.data;
        }

        this.saveData=async (url, data) => {
            let options = {
                method: "POST",
                body: JSON.stringify(data),
            };
            await fetch(url, options);
        };

        this.deleteData= async (url, id) => {
            let urldel = `${url}/${id}`;
            await fetch(urldel, { method: "Delete" });

            return await this.getArrayOfData(url);
        };

    }
}