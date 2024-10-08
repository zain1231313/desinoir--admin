// src/types/dataTypes.ts
export interface MainBanner {
    title: string;
    count: number;
    image: string;
  }
  
  export interface ServiceSection {
    mainServiceTitle: string;
    mainServiceSubTitle: string;
    uiuxTitle: string;
    uiuxDescription: string;
    uiuxIcon: string;
    brandingTitle: string;
    brandingDescription: string;
    brandingIcon: string;
    graphicDesignTitle: string;
    graphicDesignDescription: string;
    graphicDesignIcon: string;
    motionGraphicDesignTitle: string;
    motionGraphicDesignDescription: string;
    motionGraphicDesignIcon: string;
  }
  
  export interface CreativitySection {
    creativityTitle: string;
    creativitySubtitle: string;
    creativityDescription: string;
    creativityYearsOfExperience: number;
    creativityImage: string;
  }
  
  export interface OurExpertise {
    expertiseTitle: string;
    expertiseSubTitle: string;
  }
  
  export interface Data {
    en: {
      mainBanner: MainBanner;
      serviceSection: ServiceSection;
      creativitySection: CreativitySection;
      ourExpertise: OurExpertise;
    };
    ar: {
      mainBanner: MainBanner;
      serviceSection: ServiceSection;
      creativitySection: CreativitySection;
      ourExpertise: OurExpertise;
    };
  }
  
  export interface DataState {
    data: Data;
    loading: boolean;
    error: string | null;
  }
  