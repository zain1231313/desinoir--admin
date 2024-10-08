// const Server = "https://desinoir.com/backend/api/";
const Server = "http://localhost:8000/api/";



interface API_ENDPOINT {
  LOGIN: string;
  GET_HOME_PAGE: string;
  UPDATE_HOME_SECTION: string;

  GET_SLIDERS: string;
  UPDATE_SLIDERS: string;
  ADD_SLIDERS: string;
  DELETE_SLIDERS: string;

  TEAM_SECTION: string;
  ADD_TEAM: string;
  UPDATE_TEAM: string;

  OUR_WORK_SECTION: string;
  UPDATE_OUR_WORK_SECTION: string;
  DELETE_OUR_WORK_SECTION: string;

  GET_ALL_HEADERS: string;
  ADD_ALL_HEADERS: string;

  GET_ALL_ARTICLES: string;
  UPDATE_ARTICLE: string;
  DELETE_ARTICLE: string;
  ADD_ARTICLE: string;



  GET_VOICES: string;
  ADD_VOICES: string;
  DELETE_VOICES: string;
  UPDATE_VOICES: string;

  GET_UISTORE: string;
  UPDATE_UISTORE: string;
  ADD_UISTORE: string;
  DELETE_UISTORE: string;

  GET_FOOTER: string;
  ADD_FOOTER: string;

  GET_FAQS: string;
  UPDATE_SERVICES_DATA: string;
  DELETE_SERVICES_DATA: string;
  GET_META_DATA: string;
  ADD_META_DATA: string;
  DELETE_META_DATA: string;
}


const API_ENDPOINT = {
  LOGIN: Server + "auth/login",
  GET_HOME_PAGE: Server + "home/getHome-section",
  UPDATE_HOME_SECTION: Server + "home/main-section",
  GET_SLIDERS: Server + "home/get-slider-data",
  UPDATE_SLIDERS: Server + "home/update-slider-data/",
  ADD_SLIDERS: Server + "home/add-slider-data",
  DELETE_SLIDERS: Server + "home/delete-slider-data/",

  TEAM_SECTION: Server + "team/get-team-members",
  ADD_TEAM: Server + "team/add-team-members",
  UPDATE_TEAM: Server + 'team/update-team-member/',
  DELETE_MEMBER: Server + 'team/delete-team-members/',

  OUR_WORK_SECTION: Server + "our-work/get-all-our-work",
  UPDATE_OUR_WORK_SECTION: Server + "our-work/update-our-work/",
  DELETE_OUR_WORK_SECTION: Server + "our-work/delete-our-work/",
  ADD_OUR_WORK_SECTION: Server + "our-work/add-our-work",

  ////all headers

  GET_ALL_HEADERS: Server + "home/get-all-headers",
  ADD_ALL_HEADERS: Server + "home/add-header-title",



  ////Articles 

  GET_ALL_ARTICLES: Server + "articles/get-all-article",
  UPDATE_ARTICLE: Server + "articles/update-article/",
  DELETE_ARTICLE: Server + "articles/delete-article/",
  ADD_ARTICLE: Server + "articles/add-new-article",


  // Testimonial
  GET_VOICES: Server + "testimonials/get-client-voices",
  ADD_VOICES: Server + "testimonials/add-client-voices",
  UPDATE_VOICES: Server + "testimonials/update-client-voices/",
  DELETE_VOICES: Server + "testimonials/delete-client-voices/",


  GET_ABOUT: Server + "about/getAll-about-data",
  ADD_ABOUT: Server + "about/add-about-data",


  //////////ui store 

  GET_UISTORE: Server + "ui-store/get-all-ui-store",
  UPDATE_UISTORE: Server + "ui-store/update-ui-store/",
  ADD_UISTORE: Server + "ui-store/add-ui-store",
  DELETE_UISTORE: Server + "ui-store/delete-ui-store/",

  //////////////////footer
  GET_FOOTER: Server + "footer/get-footer-data",
  ADD_FOOTER: Server + "footer/add-footer-data",


  GET_FAQS: Server + "faqs/get-faqs",
  UPDATE_FAQS: Server + "faqs/update-faq/",
  DELETE_FAQS: Server + "faqs/delete-faq/",
  CREATE_FAQ: Server + "faqs/create-faq",

  GET_SERVICES: Server + "service/get-services-data?keyword=",
  UPDATE_SERVICES: Server + "service/add-service-data",
  UPDATE_SERVICES_DATA: Server + "service/update-service-data",
  DELETE_SERVICES_DATA: Server + "service/delete-service-data",


  GET_META_DATA: Server + "meta-tags/get-meta-tags",
  ADD_META_DATA: Server + "meta-tags/add-meta-tags",
  DELETE_META_DATA: Server + "meta-tags/delete-meta-tag/",



  OUR_WORK_BY_ID: Server + "our-work/getWorkById/",
  ARTICLE_BY_ID: Server + "articles/get-article-id/",
  UISTORE_BY_ID: Server + "ui-store/getUiStoreById/",
};

export default API_ENDPOINT;
