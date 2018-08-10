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
        this.axios.interceptors.response.use(response => response.data.data);
    }
    setAuthorizationHeader(token) {
        this.axios.defaults.headers.common['Authorization'] = token;
        return this;
    }
    getAppInfo() {
        return this.axios.get('/general/rows')
            .then(data => data[0])
            .then(info => {
            let app = new index_1.AppInfo(info.id);
            if (info.main_image) {
                app.main_image = this.data2image(info.main_image.data);
            }
            if (info.logo) {
                app.logo = this.data2image(info.logo.data);
            }
            app.title = info.main_title;
            app.contact_email = info.email_address;
            return app;
        });
    }
    getAbout() {
        return this.axios.get('/about/rows')
            .then(data => data[0])
            .then(info => {
            let app = new index_1.About(info.id);
            if (info.avatar_image) {
                app.avatar_image = this.data2image(info.avatar_image.data);
            }
            app.tags = new index_1.Tags(info.tags);
            app.cover_letter = info.bio;
            app.description = info.description;
            return app;
        });
    }
    getWorks() {
        return this.axios.get('/work/rows')
            .then(array => {
            let works;
            works = array.map(data => {
                let work = new index_1.Work(data.id);
                if (data.thumbnail) {
                    work.thumbnail = this.data2image(data.thumbnail.data);
                }
                work.title = data.title;
                work.url = data.url;
                work.date = data.date;
                work.info = data.info;
                work.color = data.suitable_color;
                work.tags = new index_1.Tags(data.tags);
                work.sort = data.sort;
                return work;
            });
            works = works.sort((a, b) => a.sort - b.sort);
            return works;
        });
    }
    getServices() {
        return this.axios.get('/service/rows')
            .then(array => {
            let services;
            services = array.map(data => {
                let service = new index_1.Service(data.id);
                service.title = data.title;
                service.header = data.bubble_header;
                service.text = data.bubble_text;
                service.tags = new index_1.Tags(data.tags);
                service.sort = data.sort;
                return service;
            });
            services = services.sort((a, b) => a.sort - b.sort);
            return services;
        });
    }
    getExperiences() {
        return this.axios.get('/experience/rows')
            .then(array => {
            let experiences;
            experiences = array.map(data => {
                let experience = new index_1.Experience(data.id);
                experience.title = data.title;
                experience.tags = new index_1.Tags(data.tags);
                experience.sort = data.sort;
                experience.entries = data.entries.data.map(entry => this.data2entry(entry));
                experience.entries.sort((a, b) => a.sort - b.sort);
                return experience;
            });
            experiences = experiences.sort((a, b) => a.sort - b.sort);
            return experiences;
        });
    }
    getSkills() {
        return this.axios.get('/skill/rows')
            .then(array => {
            let skills;
            skills = array.map(data => {
                let skill = new index_1.Skill(data.id);
                skill.tags = new index_1.Tags(data.tags);
                skill.sort = data.sort;
                skill.title = data.title;
                skill.text = data.text;
                skill.level = data.level;
                return skill;
            });
            skills = skills.sort((a, b) => a.level - b.level);
            return skills;
        });
    }
    getEducations() {
        return this.axios.get('/education/rows')
            .then(array => {
            let educations;
            educations = array.map(data => {
                let education = new index_1.Education(data.id);
                education.tags = new index_1.Tags(data.tags);
                education.sort = data.sort;
                education.title = data.title;
                education.text = data.text;
                if (data.logo) {
                    education.logo = this.data2image(data.logo.data);
                }
                return education;
            });
            educations = educations.sort((a, b) => a.sort - b.sort);
            return educations;
        });
    }
    getLanguages() {
        return this.axios.get('/language/rows')
            .then(array => {
            let languages;
            languages = array.map(data => {
                let language = new index_1.Language(data.id);
                language.tags = new index_1.Tags(data.tags);
                language.sort = data.sort;
                language.title = data.title;
                language.display = data.display_title;
                return language;
            });
            languages = languages.sort((a, b) => a.sort - b.sort);
            return languages;
        });
    }
    getSocials() {
        return this.axios.get('/social/rows')
            .then(array => {
            let socials;
            socials = array.map(data => {
                let social = new index_1.Social(data.id);
                social.tags = new index_1.Tags(data.tags);
                social.url = data.url;
                social.title = data.title;
                if (data.icon) {
                    social.icon = this.data2image(data.icon.data);
                }
                return social;
            });
            socials = socials.sort((a, b) => a.sort - b.sort);
            return socials;
        });
    }
    data2image(data) {
        let main_image = new index_1.Image(data.id);
        main_image.title = data.title;
        main_image.name = data.name;
        main_image.description = data.caption;
        main_image.width = data.width;
        main_image.height = data.height;
        main_image.main_url = joiner(this.baseUrl, data.url);
        main_image.tags = new index_1.Tags(data.tags);
        [160, 240, 320, 480, 640, 800, 960, 1080, 1240, 1440, 1600].forEach(size => main_image.addSource({
            url: joiner(this.baseUrl, 'thumbnail', `${size}/${size}/contain`, data.name),
            size: ['width', size]
        }));
        return main_image;
    }
    data2entry(data) {
        let entry = new index_1.ExperienceEntry(data.id);
        entry.text = data.text;
        entry.date_range = data.date_range;
        entry.location = data.location;
        entry.sort = data.sort;
        return entry;
    }
}
exports.DirectusFetcher = DirectusFetcher;
//# sourceMappingURL=DirectusFetcher.js.map