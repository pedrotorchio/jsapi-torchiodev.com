"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const joiner = require('url-join'); // preventing untyped module errors
const Procedures_1 = require("../models/utils/Procedures");
const index_1 = require("../index");
class DirectusFetcher {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.apiUrl = '/api/1.1/tables';
        this.axios = axios_1.default.create({
            baseURL: joiner(baseUrl, this.apiUrl)
        });
        this.axios.interceptors.response.use(response => {
            // takes response, 
            // extracts data from axios wrapper, 
            // then data from directys wrapper
            let array = response.data.data;
            // then for each entry, extract default available Model fields
            // id, sort, description, tags, synonyms
            let preExtracted = [];
            preExtracted = array.map(data => {
                let model = Procedures_1.data2model(data);
                return [model, data];
            });
            const [{ meta: { sort } }] = preExtracted[0];
            if (sort !== undefined)
                preExtracted = preExtracted.sort(([{ meta: { sortA } }], [{ meta: { sortB } }]) => sortA - sortB);
            return preExtracted;
        });
    }
    setAuthorizationHeader(token) {
        this.axios.defaults.headers.common['Authorization'] = token;
        return this;
    }
    getAppInfo() {
        return this.axios.get('/general/rows')
            .then(pres => pres[0])
            .then(([model, data]) => {
            let app = model.copy(index_1.AppInfo);
            if (data.main_image) {
                app.main_image = Procedures_1.data2image(data.main_image.data, this.baseUrl);
            }
            if (data.logo) {
                app.logo = Procedures_1.data2image(data.logo.data, this.baseUrl);
            }
            app.title = data.main_title;
            app.contact_email = data.email_address;
            return app;
        });
    }
}
exports.DirectusFetcher = DirectusFetcher;
//# sourceMappingURL=DirectusFetcher.js.map