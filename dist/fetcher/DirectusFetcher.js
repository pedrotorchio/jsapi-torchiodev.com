"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const joiner = require('url-join'); // preventing untyped module errors
const index_1 = require("../index");
class DirectusFetcher {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.apiUrl = '/api/1.1/tables';
        this.axios = axios_1.default.create({
            baseURL: joiner(baseUrl, this.apiUrl)
        });
    }
    setAuthorizationHeader(token) {
        this.axios.defaults.headers.common['Authorization'] = token;
        return this;
    }
    getAppInfo() {
        return this.axios.get('/general/rows')
            .then(response => response.data.data)
            .then(data => data[0])
            .then(info => {
            let app = new index_1.AppInfo();
            if (info.main_image) {
                let image = info.main_image.data;
                let main_image = new index_1.Image();
                main_image.main_url = image.url;
                app.main_image = main_image;
            }
            app.title = info.main_title;
            app.contact_email = info.email_address;
            return app;
        });
    }
    getAbout() {
        return null;
    }
    getWorks() {
        return null;
    }
    getServices() {
        return null;
    }
    getExperiences() {
        return null;
    }
    getSkills() {
        return null;
    }
    getEducations() {
        return null;
    }
    getLanguages() {
        return null;
    }
    getSocial() {
        return null;
    }
}
exports.DirectusFetcher = DirectusFetcher;
//# sourceMappingURL=DirectusFetcher.js.map