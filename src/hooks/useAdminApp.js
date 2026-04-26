import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, logout } from "../store/slices/authSlice";
import {
  fetchMe,
  loginUser,
  registerUser,
  updateMyName,
} from "../store/thunks/authThunks";
import {
  createOwnerHeroSlide,
  deleteOwnerHeroSlide,
  fetchOwnerHeroSlides,
  updateOwnerHeroSlide,
} from "../store/thunks/heroThunks";
import { fetchProfile, saveProfile } from "../store/thunks/profileThunks";
import {
  createOwnerService,
  deleteOwnerService,
  fetchOwnerServices,
  updateOwnerService,
} from "../store/thunks/serviceThunks";
import {
  createOwnerProject,
  deleteOwnerProject,
  fetchOwnerProjects,
  updateOwnerProject,
} from "../store/thunks/projectThunks";
import {
  deleteManagedUser,
  fetchManagedUsers,
  resetManagedUserPassword,
  updateManagedUserApproval,
  updateManagedUserStatus,
} from "../store/thunks/userManagementThunks";
import {
  defaultAbout,
  emptyEducation,
  emptySkill,
  emptyProject,
  emptyOwnerProject,
  emptyServiceContentSection,
  emptyService,
  emptyHeroSlide,
  emptySocial,
  defaultContact,
  TAB_LABELS,
  getTabGroupsForRole,
  normalizeServiceForm,
  normalizeHeroForm,
  SERVICE_CATEGORY_OPTIONS,
} from "../utils/adminConstants";

export const useAdminApp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error, user, signupNotice } = useSelector((state) => state.auth);
  const {
    profile,
    status: profileStatus,
    error: profileError,
  } = useSelector((state) => state.profile);
  const {
    items: ownerServices,
    status: ownerServicesStatus,
    error: ownerServicesError,
  } = useSelector((state) => state.services);
  const {
    items: ownerHeroSlides,
    status: ownerHeroStatus,
    error: ownerHeroError,
  } = useSelector((state) => state.hero);
  const {
    items: ownerProjectItems,
    status: ownerProjectsStatus,
    error: ownerProjectsError,
  } = useSelector((state) => state.ownerProjects);
  const {
    items: managedUsers,
    status: managedUsersStatus,
    error: managedUsersError,
  } = useSelector((state) => state.userManagement);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchProfile());
    }
  }, [user, dispatch]);

  const isDashboardRoute = location.pathname === "/dashboard";

  useEffect(() => {
    if (user && !isDashboardRoute && location.pathname !== "/signup") {
      navigate("/dashboard", { replace: true });
    } else if (!user && isDashboardRoute) {
      navigate("/login", { replace: true });
    }
  }, [user, isDashboardRoute, navigate, location.pathname]);

  useEffect(() => {
    dispatch(clearError());
  }, [location.pathname, dispatch]);

  const [loginData, setLoginData] = useState({ mobile: "", password: "" });
  const [signupData, setSignupData] = useState({
    fullName: "",
    mobile: "",
    password: "",
  });

  const isLoading = status === "loading";

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(loginData));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    dispatch(registerUser(signupData));
  };

  const resetSession = () => {
    dispatch(logout());
    setLoginData({ mobile: "", password: "" });
    setSignupData({ fullName: "", mobile: "", password: "" });
    navigate("/login");
  };

  // theme
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Sectional state
  const [activeTab, setActiveTab] = useState("about");
  const [about, setAbout] = useState(defaultAbout);
  const [education, setEducation] = useState([emptyEducation()]);
  const [skills, setSkills] = useState([emptySkill()]);
  const [totalExperienceYears, setTotalExperienceYears] = useState("");
  const [projects, setProjects] = useState([emptyProject()]);
  const [services, setServices] = useState([emptyService()]);
  const [ownerProjects, setOwnerProjects] = useState([emptyOwnerProject()]);
  const [heroSlides, setHeroSlides] = useState([emptyHeroSlide()]);
  const [socials, setSocials] = useState([emptySocial()]);
  const [contact, setContact] = useState(defaultContact);
  const [isFreelanceOpen, setIsFreelanceOpen] = useState(true);
  const [savingSection, setSavingSection] = useState(null);
  const [toast, setToast] = useState("");
  const [serviceDraftLoaded, setServiceDraftLoaded] = useState(false);
  const [ownerProjectDraftLoaded, setOwnerProjectDraftLoaded] = useState(false);
  const [heroDraftLoaded, setHeroDraftLoaded] = useState(false);
  const [displayNameDraft, setDisplayNameDraft] = useState("");
  const [userPasswordDrafts, setUserPasswordDrafts] = useState({});
  const [showUserPasswords, setShowUserPasswords] = useState({});

  const userRole = String(user?.role || "").toLowerCase();
  const isOwner = userRole === "owner";
  const canManageServices = userRole === "owner" || userRole === "admin";
  const tabGroups = useMemo(() => getTabGroupsForRole(userRole), [userRole]);
  const allowedTabs = useMemo(
    () => tabGroups.flatMap((group) => group.tabs),
    [tabGroups],
  );

  useEffect(() => {
    if (!profile) return;

    setAbout({ ...defaultAbout, ...(profile.about || {}) });
    setEducation(
      profile.education && profile.education.length
        ? profile.education.map((item) => ({ ...emptyEducation(), ...item }))
        : [emptyEducation()],
    );
    setSkills(
      profile.skills && profile.skills.length
        ? profile.skills.map((item) => ({ ...emptySkill(), ...item }))
        : [emptySkill()],
    );
    setTotalExperienceYears(
      profile.totalExperienceYears === 0
        ? "0"
        : String(profile.totalExperienceYears || ""),
    );
    setProjects(
      profile.projects && profile.projects.length
        ? profile.projects.map((item) => ({ ...emptyProject(), ...item }))
        : [emptyProject()],
    );
    setSocials(
      profile.socials && profile.socials.length
        ? profile.socials.map((item) => ({ ...emptySocial(), ...item }))
        : [emptySocial()],
    );
    setContact({ ...defaultContact, ...(profile.contact || {}) });
    setIsFreelanceOpen(profile.isFreelanceOpen ?? true);
  }, [profile]);

  useEffect(() => {
    if (!user || !canManageServices) return;
    dispatch(fetchOwnerServices());
  }, [dispatch, user, canManageServices]);

  useEffect(() => {
    if (!user || !canManageServices) return;
    dispatch(fetchOwnerHeroSlides());
  }, [dispatch, user, canManageServices]);

  useEffect(() => {
    if (!user || !canManageServices) return;
    dispatch(fetchOwnerProjects());
  }, [dispatch, user, canManageServices]);

  useEffect(() => {
    if (!isOwner || !user) return;
    dispatch(fetchManagedUsers());
  }, [dispatch, user, isOwner]);

  useEffect(() => {
    if (!allowedTabs.includes(activeTab)) {
      setActiveTab("about");
    }
  }, [activeTab, allowedTabs, isOwner]);

  useEffect(() => {
    if (!canManageServices) {
      setServices([emptyService()]);
      setServiceDraftLoaded(false);
      return;
    }

    if (ownerServicesStatus === "loading") return;

    setServices(
      ownerServices && ownerServices.length
        ? ownerServices.map((service) => normalizeServiceForm(service))
        : [emptyService()],
    );
    setServiceDraftLoaded(true);
  }, [ownerServices, ownerServicesStatus, canManageServices]);

  useEffect(() => {
    if (!canManageServices) {
      setHeroSlides([emptyHeroSlide()]);
      setHeroDraftLoaded(false);
      return;
    }

    if (ownerHeroStatus === "loading") return;

    setHeroSlides(
      ownerHeroSlides && ownerHeroSlides.length
        ? ownerHeroSlides.map((slide) => normalizeHeroForm(slide))
        : [emptyHeroSlide()],
    );
    setHeroDraftLoaded(true);
  }, [ownerHeroSlides, ownerHeroStatus, canManageServices]);

  useEffect(() => {
    if (!canManageServices) {
      setOwnerProjects([emptyOwnerProject()]);
      setOwnerProjectDraftLoaded(false);
      return;
    }

    if (ownerProjectsStatus === "loading") return;

    setOwnerProjects(
      ownerProjectItems && ownerProjectItems.length
        ? ownerProjectItems.map((project) => ({
          _id: project?._id || "",
          name: String(project?.name || ""),
          type: String(project?.type || ""),
          link: String(project?.link || ""),
          details: String(project?.details || ""),
          technologies: Array.isArray(project?.technologies)
            ? project.technologies
              .map((item) => String(item || "").trim())
              .filter(Boolean)
            : [],
          technologiesInput: Array.isArray(project?.technologies)
            ? project.technologies
              .map((item) => String(item || "").trim())
              .filter(Boolean)
              .join(", ")
            : "",
          sortOrder:
            Number.isFinite(Number(project?.sortOrder)) &&
            Number(project?.sortOrder) > 0 &&
            Number(project?.sortOrder) !== 999
              ? Number(project.sortOrder)
              : "",
          status: String(project?.status || "live"),
        }))
        : [emptyOwnerProject()],
    );
    setOwnerProjectDraftLoaded(true);
  }, [ownerProjectItems, ownerProjectsStatus, canManageServices]);

  const addItem = (setter, factory) => setter((prev) => [...prev, factory()]);
  const removeItem = (setter, list, index, min = 1) => {
    if (list.length <= min) return;
    setter(list.filter((_, i) => i !== index));
  };

  const handleArrayField = (setter, list, index, key, value) => {
    setter(
      list.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  };

  const sectionTitle = useMemo(() => TAB_LABELS[activeTab], [activeTab]);
  const normalizedCurrentName = String(user?.fullName || "").trim();
  const normalizedDisplayNameDraft = String(displayNameDraft || "").trim();
  const canSaveDisplayName =
    normalizedDisplayNameDraft.length >= 2 &&
    normalizedDisplayNameDraft !== normalizedCurrentName;

  useEffect(() => {
    setDisplayNameDraft(user?.fullName || "");
  }, [user?.fullName]);

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleProjectImages = async (index, files) => {
    const fileList = Array.from(files || []);
    if (!fileList.length) return;

    const asDataUrls = await Promise.all(
      fileList.map((file) => fileToDataUrl(file)),
    );

    setProjects((prev) =>
      prev.map((proj, i) => {
        if (i !== index) return proj;
        const nextGallery = [...(proj.gallery || []), ...asDataUrls].slice(
          0,
          15,
        );
        return {
          ...proj,
          gallery: nextGallery,
          coverImage: proj.coverImage || nextGallery[0] || "",
        };
      }),
    );
  };

  const removeProjectImage = (pIndex, imgIndex) => {
    setProjects((prev) =>
      prev.map((proj, i) => {
        if (i !== pIndex) return proj;
        const nextGallery = (proj.gallery || []).filter(
          (_, gi) => gi !== imgIndex,
        );
        return {
          ...proj,
          gallery: nextGallery,
          coverImage:
            proj.coverImage && nextGallery.includes(proj.coverImage)
              ? proj.coverImage
              : nextGallery[0] || "",
        };
      }),
    );
  };

  const MAX_SERVICE_SECTIONS = 20;
  const MAX_SECTION_BULLET_POINTS = 20;

  const handleHeroImageUpload = async (index, file) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setHeroSlides((prev) =>
      prev.map((slide, i) =>
        i === index ? { ...slide, image: dataUrl } : slide,
      ),
    );
  };

  const addServiceContentSection = (serviceIndex) => {
    setServices((prev) =>
      prev.map((svc, i) => {
        if (i !== serviceIndex) return svc;
        const currentSections = Array.isArray(svc.contentSections)
          ? svc.contentSections
          : [];
        if (currentSections.length >= MAX_SERVICE_SECTIONS) {
          setToast("Only 20 service sections allowed");
          setTimeout(() => setToast(""), 2200);
          return svc;
        }
        return {
          ...svc,
          contentSections: [
            ...currentSections,
            emptyServiceContentSection(),
          ],
        };
      }),
    );
  };

  const removeServiceContentSection = (serviceIndex, sectionIndex) => {
    setServices((prev) =>
      prev.map((svc, i) => {
        if (i !== serviceIndex) return svc;
        const currentSections = Array.isArray(svc.contentSections)
          ? svc.contentSections
          : [];

        if (currentSections.length <= 1) {
          return {
            ...svc,
            contentSections: [emptyServiceContentSection()],
          };
        }

        return {
          ...svc,
          contentSections: currentSections.filter((_, idx) => idx !== sectionIndex),
        };
      }),
    );
  };

  const handleServiceSectionImageUpload = async (serviceIndex, sectionIndex, file) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setServices((prev) =>
      prev.map((svc, i) => {
        if (i !== serviceIndex) return svc;
        const nextSections = Array.isArray(svc.contentSections)
          ? [...svc.contentSections]
          : [];

        while (nextSections.length <= sectionIndex) {
          nextSections.push(emptyServiceContentSection());
        }

        nextSections[sectionIndex] = {
          ...emptyServiceContentSection(),
          ...(nextSections[sectionIndex] || {}),
          image: dataUrl,
        };

        return {
          ...svc,
          contentSections: nextSections,
        }
      }),
    );
  };

  const addServiceSectionBulletPoint = (serviceIndex, sectionIndex) => {
    setServices((prev) =>
      prev.map((svc, i) => {
        if (i !== serviceIndex) return svc;
        const nextSections = Array.isArray(svc.contentSections)
          ? [...svc.contentSections]
          : [emptyServiceContentSection()];

        while (nextSections.length <= sectionIndex) {
          nextSections.push(emptyServiceContentSection());
        }

        const currentPoints = Array.isArray(nextSections[sectionIndex]?.bulletPoints)
          ? nextSections[sectionIndex].bulletPoints
          : [];
        if (currentPoints.length >= MAX_SECTION_BULLET_POINTS) {
          setToast("Only 20 bullet points allowed per section");
          setTimeout(() => setToast(""), 2200);
          return svc;
        }

        nextSections[sectionIndex] = {
          ...emptyServiceContentSection(),
          ...(nextSections[sectionIndex] || {}),
          bulletPoints: [...currentPoints, ""],
        };

        return {
          ...svc,
          contentSections: nextSections,
        };
      }),
    );
  };

  const removeServiceSectionBulletPoint = (serviceIndex, sectionIndex, bulletIndex) => {
    setServices((prev) =>
      prev.map((svc, i) => {
        if (i !== serviceIndex) return svc;
        const nextSections = Array.isArray(svc.contentSections)
          ? [...svc.contentSections]
          : [emptyServiceContentSection()];

        while (nextSections.length <= sectionIndex) {
          nextSections.push(emptyServiceContentSection());
        }

        const currentPoints = Array.isArray(nextSections[sectionIndex]?.bulletPoints)
          ? nextSections[sectionIndex].bulletPoints
          : [""];

        const filteredPoints =
          currentPoints.length <= 1
            ? [""]
            : currentPoints.filter((_, idx) => idx !== bulletIndex);

        nextSections[sectionIndex] = {
          ...emptyServiceContentSection(),
          ...(nextSections[sectionIndex] || {}),
          bulletPoints: filteredPoints,
        };

        return {
          ...svc,
          contentSections: nextSections,
        };
      }),
    );
  };

  const sanitizeServicePayload = (service) => {
    const categoryValues = SERVICE_CATEGORY_OPTIONS.map((item) => item.value);
    const normalizedCategory = categoryValues.includes(
      String(service.category || "").trim(),
    )
      ? String(service.category || "").trim()
      : SERVICE_CATEGORY_OPTIONS[0].value;

    const sections = (Array.isArray(service.contentSections)
      ? service.contentSections
      : []
    )
      .map((section) => {
        const image = String(section?.image || "").trim();
        const description = String(section?.description || "").trim();
        const bulletPoints = (section?.bulletPoints || [])
          .map((point) => String(point || "").trim())
          .filter(Boolean)
          .slice(0, MAX_SECTION_BULLET_POINTS);

        if (!image && !description && bulletPoints.length === 0) {
          return null;
        }

        return {
          image,
          description,
          bulletPoints,
        };
      })
      .filter(Boolean)
      .slice(0, MAX_SERVICE_SECTIONS);

    const fallbackImage = String(service.image || service.snapshots?.[0] || "").trim();
    const fallbackDescription = String(service.description || "").trim();
    const fallbackPoints = (service.bulletPoints || [])
      .map((point) => String(point || "").trim())
      .filter(Boolean)
      .slice(0, MAX_SECTION_BULLET_POINTS);

    const contentSections =
      sections.length > 0
        ? sections
        : [
          {
            image: fallbackImage,
            description: fallbackDescription,
            bulletPoints: fallbackPoints,
          },
        ].filter(
          (section) =>
            section.image || section.description || section.bulletPoints.length > 0,
        );

    const summary =
      String(service.description || "").trim() ||
      String(contentSections[0]?.description || "").trim();
    const legacyBulletPoints =
      (contentSections[0]?.bulletPoints || []).slice(0, 40);
    const legacySnapshots = contentSections
      .map((section) => String(section?.image || "").trim())
      .filter(Boolean)
      .slice(0, 15);

    return {
      name: String(service.name || "").trim(),
      category: normalizedCategory,
      image: "",
      description: summary,
      bulletPoints: legacyBulletPoints,
      snapshots: legacySnapshots,
      contentSections,
      sortOrder: Number.isFinite(Number(service.sortOrder))
        ? Number(service.sortOrder)
        : 0,
      isActive: service.isActive !== false,
    };
  };

  const sanitizeOwnerProjectPayload = (project) => {
    // Keep typing UX smooth in admin and parse only while saving.
    const technologiesSource =
      typeof project.technologiesInput === "string"
        ? project.technologiesInput
        : Array.isArray(project.technologies)
          ? project.technologies.join(",")
          : "";

    const technologies = technologiesSource
      .split(",")
      .map((item) => String(item || "").trim())
      .filter(Boolean)
      .slice(0, 20);
    const parsedSortOrder = Number(project.sortOrder);
    const sortOrder =
      Number.isFinite(parsedSortOrder) && parsedSortOrder > 0
        ? Math.floor(parsedSortOrder)
        : 999;

    return {
      name: String(project.name || "").trim(),
      type: String(project.type || "").trim(),
      link: String(project.link || "").trim(),
      details: String(project.details || "").trim(),
      technologies,
      sortOrder,
      status: String(project.status || "").toLowerCase() === "delivered" ? "delivered" : "live",
    };
  };

  const sanitizeHeroPayload = (slide) => ({
    image: String(slide.image || "").trim(),
    title: String(slide.title || "").trim(),
    description: String(slide.description || "").trim(),
    sortOrder: Number.isFinite(Number(slide.sortOrder))
      ? Number(slide.sortOrder)
      : 0,
    isActive: slide.isActive !== false,
  });

  const handleSaveService = async (service, index) => {
    const payload = sanitizeServicePayload(service);

    if (!payload.name) {
      setToast("Service name is required");
      setTimeout(() => setToast(""), 2200);
      return;
    }

    if (!payload.contentSections.length) {
      setToast("Add at least one section");
      setTimeout(() => setToast(""), 2200);
      return;
    }

    const invalidSectionIndex = payload.contentSections.findIndex(
      (section) => !section.description,
    );
    if (invalidSectionIndex !== -1) {
      setToast(`Section ${invalidSectionIndex + 1} needs description`);
      setTimeout(() => setToast(""), 2200);
      return;
    }

    if (!payload.description) {
      setToast("Service description is required");
      setTimeout(() => setToast(""), 2200);
      return;
    }

    const tracker = `service-${service._id || index}`;
    setSavingSection(tracker);
    try {
      if (service._id) {
        await dispatch(
          updateOwnerService({ serviceId: service._id, payload }),
        ).unwrap();
        setToast("Service updated");
      } else {
        await dispatch(createOwnerService(payload)).unwrap();
        setToast("Service created");
      }
      setServiceDraftLoaded(false);
      dispatch(fetchOwnerServices());
    } catch (err) {
      setToast(err.message || "Unable to save service");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const handleDeleteService = async (service, index) => {
    if (!service._id) {
      removeItem(setServices, services, index, 1);
      return;
    }

    const tracker = `service-delete-${service._id}`;
    setSavingSection(tracker);
    try {
      await dispatch(deleteOwnerService(service._id)).unwrap();
      setToast("Service deleted");
      setServiceDraftLoaded(false);
      dispatch(fetchOwnerServices());
    } catch (err) {
      setToast(err.message || "Unable to delete service");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const handleSaveOwnerProject = async (project, index) => {
    const payload = sanitizeOwnerProjectPayload(project);

    if (!payload.name) {
      setToast("Project name is required");
      setTimeout(() => setToast(""), 2200);
      return;
    }

    if (!payload.type) {
      setToast("Project type is required");
      setTimeout(() => setToast(""), 2200);
      return;
    }

    if (!payload.link) {
      setToast("Project link is required");
      setTimeout(() => setToast(""), 2200);
      return;
    }

    const tracker = `owner-project-${project._id || index}`;
    setSavingSection(tracker);
    try {
      if (project._id) {
        await dispatch(
          updateOwnerProject({ projectId: project._id, payload }),
        ).unwrap();
        setToast("Project updated");
      } else {
        await dispatch(createOwnerProject(payload)).unwrap();
        setToast("Project created");
      }
      setOwnerProjectDraftLoaded(false);
      dispatch(fetchOwnerProjects());
    } catch (err) {
      setToast(err.message || "Unable to save project");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const handleDeleteOwnerProject = async (project, index) => {
    if (!project._id) {
      removeItem(setOwnerProjects, ownerProjects, index, 1);
      return;
    }

    const tracker = `owner-project-delete-${project._id}`;
    setSavingSection(tracker);
    try {
      await dispatch(deleteOwnerProject(project._id)).unwrap();
      setToast("Project deleted");
      setOwnerProjectDraftLoaded(false);
      dispatch(fetchOwnerProjects());
    } catch (err) {
      setToast(err.message || "Unable to delete project");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const handleSaveHeroSlide = async (slide, index) => {
    const payload = sanitizeHeroPayload(slide);

    if (!payload.image) {
      setToast("Hero image is required");
      setTimeout(() => setToast(""), 2200);
      return;
    }

    if (!payload.title) {
      setToast("Hero title is required");
      setTimeout(() => setToast(""), 2200);
      return;
    }

    if (!payload.description) {
      setToast("Hero description is required");
      setTimeout(() => setToast(""), 2200);
      return;
    }

    const tracker = `hero-${slide._id || index}`;
    setSavingSection(tracker);
    try {
      if (slide._id) {
        await dispatch(
          updateOwnerHeroSlide({ heroId: slide._id, payload }),
        ).unwrap();
        setToast("Hero slide updated");
      } else {
        await dispatch(createOwnerHeroSlide(payload)).unwrap();
        setToast("Hero slide created");
      }
      setHeroDraftLoaded(false);
      dispatch(fetchOwnerHeroSlides());
    } catch (err) {
      setToast(err.message || "Unable to save hero slide");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const handleDeleteHeroSlide = async (slide, index) => {
    if (!slide._id) {
      removeItem(setHeroSlides, heroSlides, index, 1);
      return;
    }

    const tracker = `hero-delete-${slide._id}`;
    setSavingSection(tracker);
    try {
      await dispatch(deleteOwnerHeroSlide(slide._id)).unwrap();
      setToast("Hero slide deleted");
      setHeroDraftLoaded(false);
      dispatch(fetchOwnerHeroSlides());
    } catch (err) {
      setToast(err.message || "Unable to delete hero slide");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setAbout((prev) => ({ ...prev, avatar: dataUrl }));
    e.target.value = "";
    try {
      setSavingSection("about");
      await dispatch(
        saveProfile({
          about: sanitizeAbout({ ...about, avatar: dataUrl }),
          isFreelanceOpen,
        }),
      ).unwrap();
      setToast("About saved");
    } catch (err) {
      setToast(err.message || "Unable to save photo");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const prepDates = (value) => (value ? new Date(value).toISOString() : null);
  const prepNumber = (value) =>
    value === "" || value === null ? undefined : Number(value);
  const sanitizeAbout = (value = about) => {
    const { availability: _availability, ...rest } = value || {};
    return rest;
  };

  const buildPayload = (section) => {
    switch (section) {
      case "about":
        return { about: sanitizeAbout(), isFreelanceOpen };
      case "education":
        return {
          education: education.map((edu) => ({
            ...edu,
            startYear: prepNumber(edu.startYear),
            endYear: edu.currentlyStudying
              ? undefined
              : prepNumber(edu.endYear),
            highlights: edu.highlights || [],
          })),
        };
      case "skills":
        return {
          skills: skills.map((skill) => ({
            ...skill,
            years: prepNumber(skill.years),
            keywords: skill.keywords || [],
          })),
        };
      case "experience":
        return {
          totalExperienceYears: prepNumber(totalExperienceYears) ?? 0,
        };
      case "projects":
        return {
          projects: projects.map((proj) => ({
            ...proj,
            startedAt: prepDates(proj.startedAt),
            endedAt: prepDates(proj.endedAt),
            tech: proj.tech || [],
            highlights: proj.highlights || [],
            gallery: (proj.gallery || []).slice(0, 15),
          })),
        };
      case "services":
        return {};
      case "socials":
        return {
          socials: socials.map((soc) => ({
            ...soc,
            followers: prepNumber(soc.followers) || 0,
            impressionsLast30: prepNumber(soc.impressionsLast30) || 0,
            engagementRate: prepNumber(soc.engagementRate) || 0,
          })),
        };
      case "contact":
        return { contact: { ...contact }, isFreelanceOpen };
      default:
        return {};
    }
  };

  const handleSaveSection = async (section) => {
    setSavingSection(section);
    try {
      const payload = buildPayload(section);
      await dispatch(saveProfile(payload)).unwrap();
      setToast(`${TAB_LABELS[section]} saved`);
    } catch (err) {
      setToast(err.message || "Unable to save");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const handleToggleUserStatus = async (targetUser) => {
    if (!targetUser?.id) return;
    const tracker = `user-status-${targetUser.id}`;
    setSavingSection(tracker);
    try {
      await dispatch(
        updateManagedUserStatus({
          userId: targetUser.id,
          isActive: !(targetUser.isActive !== false),
        }),
      ).unwrap();
      setToast("User status updated");
    } catch (err) {
      setToast(err.message || "Unable to update user status");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (!targetUser?.id) return;
    const tracker = `user-delete-${targetUser.id}`;
    setSavingSection(tracker);
    try {
      await dispatch(deleteManagedUser(targetUser.id)).unwrap();
      setToast("User deleted");
    } catch (err) {
      setToast(err.message || "Unable to delete user");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const handleUpdateUserApproval = async (targetUser, approvalStatus) => {
    if (!targetUser?.id) return;
    const tracker = `user-approval-${targetUser.id}-${approvalStatus}`;
    setSavingSection(tracker);
    try {
      await dispatch(
        updateManagedUserApproval({
          userId: targetUser.id,
          approvalStatus,
        }),
      ).unwrap();
      setToast(`User ${approvalStatus}`);
    } catch (err) {
      setToast(err.message || "Unable to update user approval");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const setManagedUserPasswordDraft = (userId, value) => {
    if (!userId) return;
    setUserPasswordDrafts((prev) => ({ ...prev, [userId]: value }));
  };

  const toggleManagedUserPasswordVisibility = (userId) => {
    if (!userId) return;
    setShowUserPasswords((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleResetManagedUserPassword = async (targetUser) => {
    const userId = targetUser?.id;
    if (!userId) return;
    const newPassword = String(userPasswordDrafts[userId] || "").trim();

    if (newPassword.length < 8) {
      setToast("Password must be at least 8 characters");
      setTimeout(() => setToast(""), 2200);
      return;
    }

    const tracker = `user-password-${userId}`;
    setSavingSection(tracker);
    try {
      await dispatch(resetManagedUserPassword({ userId, newPassword })).unwrap();
      setUserPasswordDrafts((prev) => ({ ...prev, [userId]: "" }));
      setShowUserPasswords((prev) => ({ ...prev, [userId]: false }));
      setToast("Password reset successfully");
    } catch (err) {
      setToast(err.message || "Unable to reset password");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  const handleSaveDisplayName = async () => {
    if (!canSaveDisplayName) {
      if (normalizedDisplayNameDraft.length < 2) {
        setToast("Name must be at least 2 characters");
        setTimeout(() => setToast(""), 2200);
      }
      return;
    }

    setSavingSection("display-name");
    try {
      await dispatch(updateMyName(normalizedDisplayNameDraft)).unwrap();
      setToast("Name updated");
    } catch (err) {
      setToast(err.message || "Unable to update name");
    } finally {
      setSavingSection(null);
      setTimeout(() => setToast(""), 2200);
    }
  };

  return {
    dispatch,
    navigate,
    location,
    user,
    status,
    error,
    signupNotice,
    profile,
    profileStatus,
    profileError,
    ownerServices,
    ownerServicesStatus,
    ownerServicesError,
    ownerHeroSlides,
    ownerHeroStatus,
    ownerHeroError,
    ownerProjectItems,
    ownerProjectsStatus,
    ownerProjectsError,
    managedUsers,
    managedUsersStatus,
    managedUsersError,
    isOwner,
    tabGroups,
    allowedTabs,
    loginData,
    setLoginData,
    signupData,
    setSignupData,
    isLoading,
    handleLogin,
    handleSignup,
    resetSession,
    theme,
    setTheme,
    activeTab,
    setActiveTab,
    about,
    setAbout,
    education,
    setEducation,
    skills,
    setSkills,
    totalExperienceYears,
    setTotalExperienceYears,
    projects,
    setProjects,
    services,
    setServices,
    ownerProjects,
    setOwnerProjects,
    heroSlides,
    setHeroSlides,
    socials,
    setSocials,
    contact,
    setContact,
    isFreelanceOpen,
    setIsFreelanceOpen,
    savingSection,
    toast,
    setToast,
    serviceDraftLoaded,
    ownerProjectDraftLoaded,
    heroDraftLoaded,
    displayNameDraft,
    setDisplayNameDraft,
    canSaveDisplayName,
    userPasswordDrafts,
    showUserPasswords,
    canManageServices,
    sectionTitle,
    addItem,
    removeItem,
    handleArrayField,
    handleProjectImages,
    removeProjectImage,
    handleHeroImageUpload,
    addServiceContentSection,
    removeServiceContentSection,
    handleServiceSectionImageUpload,
    addServiceSectionBulletPoint,
    removeServiceSectionBulletPoint,
    handleSaveService,
    handleDeleteService,
    handleSaveOwnerProject,
    handleDeleteOwnerProject,
    handleSaveHeroSlide,
    handleDeleteHeroSlide,
    handleAvatarUpload,
    handleSaveSection,
    handleToggleUserStatus,
    handleDeleteUser,
    handleUpdateUserApproval,
    setManagedUserPasswordDraft,
    toggleManagedUserPasswordVisibility,
    handleResetManagedUserPassword,
    handleSaveDisplayName,
    fetchManagedUsers,
    fetchOwnerProjects,
  };
};
