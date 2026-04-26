export const defaultAbout = {
  headline: "",
  summary: "",
  location: "",
  avatar: "",
  website: "",
};

export const emptyEducation = () => ({
  institution: "",
  degree: "",
  field: "",
  startYear: "",
  endYear: "",
  currentlyStudying: false,
  grade: "",
  highlights: [],
  location: "",
});

export const emptySkill = () => ({
  name: "",
  level: "mid",
  years: "",
  stack: "fullstack",
  keywords: [],
});

export const emptyExperience = () => ({
  company: "",
  title: "",
  employmentType: "full-time",
  location: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  achievements: [],
  tech: [],
});

export const emptyProject = () => ({
  title: "",
  role: "",
  description: "",
  tech: [],
  repoUrl: "",
  liveUrl: "",
  coverImage: "",
  gallery: [],
  status: "completed",
  startedAt: "",
  endedAt: "",
  highlights: [],
});

export const emptyServiceContentSection = () => ({
  image: "",
  description: "",
  bulletPoints: [""],
});

export const SERVICE_CATEGORY_OPTIONS = [
  {
    value: "website-development",
    label: "Website Development",
  },
  {
    value: "app-development",
    label: "App Development",
  },
  {
    value: "webview-development",
    label: "WebView Development",
  },
  {
    value: "seo-content-marketing",
    label: "SEO & Content Marketing",
  },
  {
    value: "cloud-server-management",
    label: "Cloud & Server Management",
  },
];

export const emptyService = () => ({
  _id: "",
  name: "",
  category: SERVICE_CATEGORY_OPTIONS[0].value,
  image: "",
  description: "",
  bulletPoints: [""],
  snapshots: [],
  contentSections: [emptyServiceContentSection()],
  sortOrder: 0,
  isActive: true,
});

export const emptyOwnerProject = () => ({
  _id: "",
  name: "",
  type: "",
  link: "",
  details: "",
  technologies: [],
  technologiesInput: "",
  sortOrder: "",
  status: "live",
});

export const emptyHeroSlide = () => ({
  _id: "",
  image: "",
  title: "",
  description: "",
  sortOrder: 0,
  isActive: true,
});

export const emptySocial = () => ({
  platform: "linkedin",
  handle: "",
  url: "",
  followers: 0,
  impressionsLast30: 0,
  engagementRate: 0,
});

export const defaultContact = {
  email: "",
  phone: "",
  website: "",
  linkedin: "",
  github: "",
  twitter: "",
  dribbble: "",
  address: "",
};

export const TAB_LABELS = {
  about: "About",
  education: "Education",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  ownerProjects: "Projects",
  services: "Services",
  hero: "Hero",
  consultations: "Consultations",
  users: "Users",
  socials: "Socials",
  contact: "Contact",
};

export const PROFILE_SETUP_TABS = [
  "about",
  "skills",
  "experience",
];
export const PARTNER_PROFILE_TABS = ["about", "skills", "experience"];
export const OWNER_ACCESS_TABS = ["services", "hero", "ownerProjects", "consultations", "users"];

export const TAB_GROUPS = [
  { key: "profile-setup", title: "Profile Setup", tabs: PROFILE_SETUP_TABS },
  { key: "owner-access", title: "Owner Access", tabs: OWNER_ACCESS_TABS },
];

export const getTabGroupsForRole = (role) => {
  const normalizedRole = String(role || "").toLowerCase();
  const profileTabs =
    normalizedRole === "partner" ? PARTNER_PROFILE_TABS : PROFILE_SETUP_TABS;
  const groups = [
    { key: "profile-setup", title: "Profile Setup", tabs: profileTabs },
  ];

  if (normalizedRole === "owner") {
    groups.push({
      key: "owner-access",
      title: "Owner Access",
      tabs: OWNER_ACCESS_TABS,
    });
  }

  return groups;
};

export const arrayFromCsv = (value = "") =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export const normalizeServiceForm = (service = {}) => ({
  ...emptyService(),
  ...service,
  category: SERVICE_CATEGORY_OPTIONS.some(
    (item) => item.value === String(service.category || "").trim(),
  )
    ? String(service.category || "").trim()
    : SERVICE_CATEGORY_OPTIONS[0].value,
  bulletPoints:
    Array.isArray(service.bulletPoints) && service.bulletPoints.length
      ? service.bulletPoints
      : [""],
  snapshots: Array.isArray(service.snapshots)
    ? service.snapshots.slice(0, 15)
    : [],
  contentSections:
    Array.isArray(service.contentSections) && service.contentSections.length
      ? service.contentSections.slice(0, 20).map((section) => ({
        ...emptyServiceContentSection(),
        ...section,
        bulletPoints:
          Array.isArray(section?.bulletPoints) && section.bulletPoints.length
            ? section.bulletPoints
            : [""],
      }))
      : [
        {
          ...emptyServiceContentSection(),
          image: String(service.image || service.snapshots?.[0] || "").trim(),
          description: String(service.description || "").trim(),
          bulletPoints:
            Array.isArray(service.bulletPoints) && service.bulletPoints.length
              ? service.bulletPoints
              : [""],
        },
      ],
});

export const normalizeHeroForm = (slide = {}) => ({
  ...emptyHeroSlide(),
  ...slide,
});
