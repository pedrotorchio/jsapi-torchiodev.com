import axios from "axios";
const joiner: any = require("url-join"); // preventing untyped module errors

import { IFetcher } from "../IFetcher";
import { data2image, data2model } from "../models/utils/Procedures";

import {
  AppInfo,
  About,
  Work,
  Service,
  Experience,
  ExperienceEntry,
  Skill,
  Education,
  Language,
  Social,
  Image,
  Tags,
  Model
} from "../index";

export class DirectusFetcher implements IFetcher {
  private axios;
  private apiUrl: string = "/api/1.1/tables";

  constructor(private baseUrl: string) {
    this.axios = axios.create({
      baseURL: joiner(baseUrl, this.apiUrl)
    });

    this.axios.interceptors.response.use(response => {
      // takes response,
      // extracts data from axios wrapper,
      // then data from directys wrapper
      let array = response.data.data;
      // then for each entry, extract default available Model fields
      // id, sort, description, tags, synonyms
      let preExtracted: [Model, {}][] = [];

      preExtracted = array.map(data => {
        let model: Model = data2model(data);

        return [model, data];
      });
      const [
        {
          meta: { sort }
        }
      ] = preExtracted[0];

      if (sort !== undefined)
        preExtracted = preExtracted.sort(
          (
            [
              {
                meta: { sortA }
              }
            ],
            [
              {
                meta: { sortB }
              }
            ]
          ) => sortA - sortB
        );

      return preExtracted;
    });
  }

  setAuthorizationHeader(token: string): IFetcher {
    this.axios.defaults.headers.common["Authorization"] = token;
    return this;
  }
  getAppInfo(): Promise<AppInfo> {
    return this.axios
      .get("/general/rows")
      .then(pres => pres[0])
      .then(([model, data]) => {
        let app: AppInfo = model.copyInto(AppInfo);
        app.title = data.main_title;
        app.contact_email = data.email_address;

        if (data.main_image) {
          app.main_image = data2image(data.main_image.data, this.baseUrl);
        }
        if (data.logo) {
          app.logo = data2image(data.logo.data, this.baseUrl);
        }

        return app;
      });
  }
  getAbout(): Promise<About> {
    return this.axios
      .get("/about/rows")
      .then(pres => pres[0])
      .then(([model, data]) => {
        let about: About = model.copyInto(About);
        about.cover_letter = data.bio;

        if (data.avatar_image) {
          about.avatar_image = data2image(data.avatar_image.data);
        }

        return about;
      });
  }
  // getWorks(): Promise<Work[]> {

  //   return this.axios.get('/work/rows')
  //       .then(array => {
  //         let works: Work[];

  //         works = array.map( data => {

  //           let work = new Work(data.id);

  //           if (data.thumbnail) {
  //             work.thumbnail = data2model(data.thumbnail.data);
  //           }

  //           work.title = data.title;
  //           work.url = data.url;
  //           work.date = data.date;
  //           work.info = data.info;
  //           work.color = data.suitable_color;
  //           work.tags = new Tags(data.tags);
  //           work.sort = data.sort;

  //           return work;
  //         });
  //         works = works.sort( (a, b) => a.sort - b.sort );

  //         return works;

  //       });
  // }
  // getServices(): Promise<Service[]> {

  //   return this.axios.get('/service/rows')
  //       .then(array => {
  //         let services: Service[];

  //         services = array.map( data => {

  //           let service = new Service(data.id);

  //           service.title = data.title;
  //           service.header = data.bubble_header;
  //           service.text = data.bubble_text;
  //           service.tags = new Tags(data.tags);
  //           service.sort = data.sort;

  //           return service;
  //         });
  //         services = services.sort( (a, b) => a.sort - b.sort );

  //         return services;

  //       });
  // }
  // getExperiences(): Promise<Experience[]> {

  //   return this.axios.get('/experience/rows')
  //       .then(array => {

  //         let experiences: Experience[];

  //         experiences = array.map( data => {

  //           let experience = new Experience(data.id);

  //           experience.title = data.title;
  //           experience.tags = new Tags(data.tags);
  //           experience.sort = data.sort;

  //           experience.entries = data.entries.data.map( entry => this.data2entry(entry) );
  //           experience.entries.sort( (a, b) => a.sort - b.sort );

  //           return experience;
  //         });
  //         experiences = experiences.sort( (a, b) => a.sort - b.sort );

  //         return experiences;

  //       });
  // }
  // getSkills(): Promise<Skill[]> {

  //   return this.axios.get('/skill/rows')
  //       .then(array => {
  //         let skills: Skill[];

  //         skills = array.map( data => {

  //           let skill = new Skill(data.id);

  //           skill.tags = new Tags(data.tags);
  //           skill.sort = data.sort;
  //           skill.title = data.title;
  //           skill.text = data.text;
  //           skill.level = data.level;

  //           return skill;
  //         });
  //         skills = skills.sort( (a, b) => a.level - b.level );

  //         return skills;

  //       });
  // }
  // getEducations(): Promise<Education[]> {

  //   return this.axios.get('/education/rows')
  //       .then(array => {
  //         let educations: Education[];

  //         educations = array.map( data => {

  //           let education = new Education(data.id);

  //           education.tags = new Tags(data.tags);
  //           education.sort = data.sort;
  //           education.title = data.title;
  //           education.text = data.text;

  //           if (data.logo) {
  //             education.logo = data2model(data.logo.data);
  //           }

  //           return education;
  //         });
  //         educations = educations.sort( (a, b) => a.sort - b.sort );

  //         return educations;

  //       });

  // }
  // getLanguages(): Promise<Language[]> {

  //   return this.axios.get('/language/rows')
  //       .then(array => {
  //         let languages: Language[];

  //         languages = array.map( data => {

  //           let language = new Language(data.id);

  //           language.tags = new Tags(data.tags);
  //           language.sort = data.sort;
  //           language.title = data.title;
  //           language.display = data.display_title;

  //           return language;
  //         });
  //         languages = languages.sort( (a, b) => a.sort - b.sort );

  //         return languages;

  //       });
  // }
  // getSocials(): Promise<Social[]> {

  //   return this.axios.get('/social/rows')
  //       .then(array => {
  //         let socials: Social[];

  //         socials = array.map( data => {

  //           let social = new Social(data.id);

  //           social.tags = new Tags(data.tags);
  //           social.url = data.url;
  //           social.title = data.title;

  //           if (data.icon) {
  //             social.icon = data2model(data.icon.data);
  //           }

  //           return social;
  //         });
  //         socials = socials.sort( (a, b) => a.sort - b.sort );

  //         return socials;

  //       });

  // }
}
