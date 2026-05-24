export interface Brief {
  meta?: { version: string; templateId: string; createdAt: string; updatedAt: string };
  brand: {
    name: string;
    tagline: string;
    industry: string;
    target: string;
    tones: string[];
    avoidTones: string;
    siteUrl: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    heroBg: string;
    surface: string;
    text: string;
    muted: string;
  };
  images: {
    logo: string;
    favicon: string;
    hero: string;
    problem1: string;
    problem2: string;
    problem3: string;
    serviceMain: string;
    curriculum: string;
  };
  copy: {
    heroEyebrow: string;
    heroHeadline: string;
    heroSubheadline: string;
    heroCtaPrimary: string;
    heroCtaSecondary: string;
    problemsHeading: string;
    problemsSubheading: string;
    problems: { no: string; title: string; desc: string }[];
    serviceHeading: string;
    serviceSubheading: string;
    service: { tag: string; title: string; desc: string; points: string }[];
    curriculumHeading: string;
    curriculumSubheading: string;
    curriculum: { phase: string; title: string; desc: string; tags: string }[];
    faqHeading: string;
    faq: { q: string; a: string }[];
    ctaHeadline: string;
    ctaDesc: string;
    ctaPrimary: string;
    ctaSecondary: string;
    formspreeEndpoint: string;
  };
}
