import ConsultationsPanel from './ConsultationsPanel'
import {
  arrayFromCsv,
  emptyEducation,
  emptyHeroSlide,
  emptyOwnerProject,
  emptyProject,
  emptyService,
  emptySkill,
  emptySocial,
  SERVICE_CATEGORY_OPTIONS,
} from '../utils/adminConstants'

export const getSectionRenderers = (adminData) => {
  const SectionHeader = ({ title, cta }) => (
    <div className="section-head">
      <h3>{title}</h3>
      {cta}
    </div>
  )

  const Badge = ({ children }) => <span className="badge">{children}</span>

  const {
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
    canManageServices,
    ownerServicesStatus,
    ownerServicesError,
    ownerHeroStatus,
    ownerHeroError,
    ownerProjectsStatus,
    ownerProjectsError,
    managedUsers,
    managedUsersStatus,
    managedUsersError,
    user,
    serviceDraftLoaded,
    ownerProjectDraftLoaded,
    heroDraftLoaded,
    isOwner,
    dispatch,
    fetchOwnerServices,
    fetchOwnerProjects,
    fetchOwnerHeroSlides,
    fetchManagedUsers,
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
    handleSaveSection,
    handleToggleUserStatus,
    handleDeleteUser,
    handleUpdateUserApproval,
    userPasswordDrafts,
    showUserPasswords,
    setManagedUserPasswordDraft,
    toggleManagedUserPasswordVisibility,
    handleResetManagedUserPassword,
  } = adminData

  return {
    about: () => (
      <div className="section">
        <SectionHeader title="About you" />
        <label className="field">
          <span>Designation</span>
          <input
            value={about.headline}
            onChange={(e) => setAbout((prev) => ({ ...prev, headline: e.target.value }))}
            placeholder="FullStack Developer"
          />
        </label>
        <label className="field">
          <span>Intro</span>
          <textarea
            rows={4}
            value={about.summary}
            onChange={(e) => setAbout((prev) => ({ ...prev, summary: e.target.value }))}
            placeholder="Short, 3-4 sentence story about you"
          />
        </label>
        <label className="field">
          <span>Image URL</span>
          <input
            value={about.avatar}
            onChange={(e) => setAbout((prev) => ({ ...prev, avatar: e.target.value }))}
            placeholder="https://.../me.jpg"
          />
        </label>
        <button
          className="primary"
          type="button"
          onClick={() => handleSaveSection('about')}
          disabled={savingSection === 'about'}
        >
          {savingSection === 'about' ? 'Saving…' : 'Save About'}
        </button>
      </div>
    ),
    education: () => (
      <div className="section">
        <SectionHeader
          title="Education"
          cta={
            <button
              className="primary"
              type="button"
              onClick={() => handleSaveSection('education')}
              disabled={savingSection === 'education'}
            >
              {savingSection === 'education' ? 'Saving…' : 'Save Education'}
            </button>
          }
        />
        <div className="stack">
          {education.map((edu, idx) => (
            <div className="item-card" key={`edu-${idx}`}>
              <div className="item-top">
                <strong>Entry {idx + 1}</strong>
                <div className="item-actions">
                  <Badge>{edu.currentlyStudying ? 'Current' : 'Alumni'}</Badge>
                  <button
                    className="link-btn"
                    type="button"
                    onClick={() => removeItem(setEducation, education, idx)}
                    disabled={education.length === 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="grid two">
                <label className="field">
                  <span>Institution</span>
                  <input
                    value={edu.institution}
                    onChange={(e) => handleArrayField(setEducation, education, idx, 'institution', e.target.value)}
                    placeholder="College / University"
                  />
                </label>
                <label className="field">
                  <span>Degree</span>
                  <input
                    value={edu.degree}
                    onChange={(e) => handleArrayField(setEducation, education, idx, 'degree', e.target.value)}
                    placeholder="B.Tech / B.Sc / MBA"
                  />
                </label>
              </div>
              <div className="grid three">
                <label className="field">
                  <span>Field</span>
                  <input
                    value={edu.field}
                    onChange={(e) => handleArrayField(setEducation, education, idx, 'field', e.target.value)}
                    placeholder="Computer Science"
                  />
                </label>
                <label className="field">
                  <span>Start year</span>
                  <input
                    type="number"
                    value={edu.startYear}
                    onChange={(e) => handleArrayField(setEducation, education, idx, 'startYear', e.target.value)}
                  />
                </label>
                <label className="field">
                  <span>End year</span>
                  <input
                    type="number"
                    value={edu.endYear}
                    onChange={(e) => handleArrayField(setEducation, education, idx, 'endYear', e.target.value)}
                    disabled={edu.currentlyStudying}
                  />
                </label>
              </div>
              <div className="grid two">
                <label className="field">
                  <span>Grade / Score</span>
                  <input
                    value={edu.grade}
                    onChange={(e) => handleArrayField(setEducation, education, idx, 'grade', e.target.value)}
                  />
                </label>
                <label className="field">
                  <span>Location</span>
                  <input
                    value={edu.location}
                    onChange={(e) => handleArrayField(setEducation, education, idx, 'location', e.target.value)}
                  />
                </label>
              </div>
              <label className="field">
                <span>Highlights (comma separated)</span>
                <input
                  value={(edu.highlights || []).join(', ')}
                  onChange={(e) =>
                    handleArrayField(setEducation, education, idx, 'highlights', arrayFromCsv(e.target.value))
                  }
                />
              </label>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={edu.currentlyStudying}
                  onChange={(e) =>
                    handleArrayField(setEducation, education, idx, 'currentlyStudying', e.target.checked)
                  }
                />
                <span>Currently studying here</span>
              </label>
            </div>
          ))}
        </div>
        <button className="ghost" type="button" onClick={() => addItem(setEducation, emptyEducation)}>
          + Add another education
        </button>
      </div>
    ),
    skills: () => (
      <div className="section">
        <SectionHeader title="Skills" />
        <div className="stack">
          {skills.map((skill, idx) => (
            <div className="item-card" key={`skill-${idx}`}>
              <div className="item-top">
                <strong>Skill {idx + 1}</strong>
                <button
                  className="link-btn"
                  type="button"
                  onClick={() => removeItem(setSkills, skills, idx)}
                  disabled={skills.length === 1}
                >
                  Remove
                </button>
              </div>
              <div className="grid two">
                <label className="field">
                  <span>Skill</span>
                  <input
                    value={skill.name}
                    onChange={(e) => handleArrayField(setSkills, skills, idx, 'name', e.target.value)}
                    placeholder="React"
                  />
                </label>
                <label className="field">
                  <span>Years of experience</span>
                  <input
                    type="number"
                    value={skill.years}
                    onChange={(e) => handleArrayField(setSkills, skills, idx, 'years', e.target.value)}
                    placeholder="2"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
        <button className="ghost" type="button" onClick={() => addItem(setSkills, emptySkill)}>
          + Add skill
        </button>
        <button
          className="primary"
          type="button"
          onClick={() => handleSaveSection('skills')}
          disabled={savingSection === 'skills'}
        >
          {savingSection === 'skills' ? 'Saving…' : 'Save Skills'}
        </button>
      </div>
    ),
    experience: () => (
      <div className="section">
        <SectionHeader title="Experience" />
        <label className="field">
          <span>Total years of experience</span>
          <input
            type="number"
            min="0"
            step="0.1"
            value={totalExperienceYears}
            onChange={(e) => setTotalExperienceYears(e.target.value)}
            placeholder="2"
          />
        </label>
        <button
          className="primary"
          type="button"
          onClick={() => handleSaveSection('experience')}
          disabled={savingSection === 'experience'}
        >
          {savingSection === 'experience' ? 'Saving…' : 'Save Experience'}
        </button>
      </div>
    ),
    projects: () => (
      <div className="section">
        <SectionHeader
          title="Projects"
          cta={
            <button
              className="primary"
              type="button"
              onClick={() => handleSaveSection('projects')}
              disabled={savingSection === 'projects'}
            >
              {savingSection === 'projects' ? 'Saving…' : 'Save Projects'}
            </button>
          }
        />
        <div className="stack">
          {projects.map((proj, idx) => (
            <div className="item-card" key={`proj-${idx}`}>
              <div className="item-top">
                <strong>Project {idx + 1}</strong>
                <button
                  className="link-btn"
                  type="button"
                  onClick={() => removeItem(setProjects, projects, idx)}
                  disabled={projects.length === 1}
                >
                  Remove
                </button>
              </div>
              <div className="grid two">
                <label className="field">
                  <span>Title</span>
                  <input
                    value={proj.title}
                    onChange={(e) => handleArrayField(setProjects, projects, idx, 'title', e.target.value)}
                  />
                </label>
                <label className="field">
                  <span>Role</span>
                  <input
                    value={proj.role}
                    onChange={(e) => handleArrayField(setProjects, projects, idx, 'role', e.target.value)}
                  />
                </label>
              </div>
              <label className="field">
                <span>Summary</span>
                <textarea
                  rows={3}
                  value={proj.description}
                  onChange={(e) => handleArrayField(setProjects, projects, idx, 'description', e.target.value)}
                />
              </label>
              <div className="grid two">
                <label className="field">
                  <span>Live URL</span>
                  <input
                    value={proj.liveUrl}
                    onChange={(e) => handleArrayField(setProjects, projects, idx, 'liveUrl', e.target.value)}
                  />
                </label>
                <label className="field">
                  <span>Repo URL</span>
                  <input
                    value={proj.repoUrl}
                    onChange={(e) => handleArrayField(setProjects, projects, idx, 'repoUrl', e.target.value)}
                  />
                </label>
              </div>
              <div className="grid three">
                <label className="field">
                  <span>Status</span>
                  <select
                    value={proj.status}
                    onChange={(e) => handleArrayField(setProjects, projects, idx, 'status', e.target.value)}
                  >
                    <option value="planned">Planned</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </label>
                <label className="field">
                  <span>Start</span>
                  <input
                    type="date"
                    value={proj.startedAt?.slice(0, 10) || ''}
                    onChange={(e) => handleArrayField(setProjects, projects, idx, 'startedAt', e.target.value)}
                  />
                </label>
                <label className="field">
                  <span>End</span>
                  <input
                    type="date"
                    value={proj.endedAt?.slice(0, 10) || ''}
                    onChange={(e) => handleArrayField(setProjects, projects, idx, 'endedAt', e.target.value)}
                  />
                </label>
              </div>
              <div className="grid two">
                <label className="field">
                  <span>Tech (comma separated)</span>
                  <input
                    value={(proj.tech || []).join(', ')}
                    onChange={(e) => handleArrayField(setProjects, projects, idx, 'tech', arrayFromCsv(e.target.value))}
                  />
                </label>
                <label className="field">
                  <span>Highlights (comma separated)</span>
                  <input
                    value={(proj.highlights || []).join(', ')}
                    onChange={(e) =>
                      handleArrayField(setProjects, projects, idx, 'highlights', arrayFromCsv(e.target.value))
                    }
                  />
                </label>
              </div>
              <div className="grid two">
                <label className="field">
                  <span>Cover image URL</span>
                  <input
                    value={proj.coverImage}
                    onChange={(e) => handleArrayField(setProjects, projects, idx, 'coverImage', e.target.value)}
                  />
                </label>
                <label className="field">
                  <span>Upload gallery (max 15)</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleProjectImages(idx, e.target.files)}
                  />
                </label>
              </div>
              <div className="gallery-row">
                <div className="chip">{(proj.gallery || []).length} / 15 images</div>
                <div className="thumbs">
                  {(proj.gallery || []).map((img, gi) => (
                    <div className="thumb" key={`g-${gi}`}>
                      <img src={img} alt={`gallery-${gi}`} />
                      <button type="button" className="link-btn" onClick={() => removeProjectImage(idx, gi)}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="ghost" type="button" onClick={() => addItem(setProjects, emptyProject)}>
          + Add project
        </button>
      </div>
    ),
    services: () => (
      <div className="section">
        <SectionHeader
          title="Owner Services"
          cta={
            canManageServices ? (
              <button
                className="ghost"
                type="button"
                onClick={() => dispatch(fetchOwnerServices())}
                disabled={ownerServicesStatus === 'loading'}
              >
                {ownerServicesStatus === 'loading' ? 'Refreshing…' : 'Refresh'}
              </button>
            ) : null
          }
        />
        {!canManageServices && (
          <p className="muted">Only owner/admin accounts can add, update, or delete services from this dashboard.</p>
        )}
        {canManageServices && (
          <p className="hint">
            Build each service with repeatable sections. Description is required, image and bullet lines are optional.
          </p>
        )}
        {canManageServices && ownerServicesError && <p className="error">{ownerServicesError}</p>}
        <div className="stack">
          {services.map((svc, idx) => (
            <details className="accordion" key={`svc-${idx}`} open={idx === 0}>
              <summary className="accordion-summary">
                <span className="accordion-title">
                  {svc._id ? `Service ${idx + 1}` : `New Service ${idx + 1}`}
                </span>
                <span className="accordion-meta">
                  {svc.name ? svc.name : 'Untitled'}
                  {` · ${
                    SERVICE_CATEGORY_OPTIONS.find((item) => item.value === svc.category)?.label || 'Website Development'
                  }`}
                  {svc.isActive === false ? ' · Inactive' : ' · Active'}
                </span>
              </summary>
              <div className="item-card accordion-body">
                <div className="item-top">
                  <strong>{svc._id ? `Service ${idx + 1}` : 'New Service Draft'}</strong>
                  <button
                    className="link-btn"
                    type="button"
                    onClick={() => handleDeleteService(svc, idx)}
                    disabled={
                      !canManageServices ||
                      savingSection === `service-delete-${svc._id}` ||
                      savingSection === `service-${svc._id || idx}`
                    }
                  >
                    {svc._id ? 'Delete' : 'Remove'}
                  </button>
                </div>
                <div className="grid three">
                <label className="field">
                  <span>Service name</span>
                  <input
                    value={svc.name}
                    onChange={(e) => handleArrayField(setServices, services, idx, 'name', e.target.value)}
                    disabled={!canManageServices}
                  />
                </label>
                <label className="field">
                  <span>Service category</span>
                  <select
                    value={svc.category || SERVICE_CATEGORY_OPTIONS[0].value}
                    onChange={(e) => handleArrayField(setServices, services, idx, 'category', e.target.value)}
                    disabled={!canManageServices}
                  >
                    {SERVICE_CATEGORY_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Sort order</span>
                  <input
                    type="number"
                    value={svc.sortOrder ?? 0}
                    onChange={(e) => handleArrayField(setServices, services, idx, 'sortOrder', e.target.value)}
                    disabled={!canManageServices}
                  />
                </label>
                <label className="field">
                  <span>Status</span>
                  <select
                    value={svc.isActive === false ? 'inactive' : 'active'}
                    onChange={(e) =>
                      handleArrayField(setServices, services, idx, 'isActive', e.target.value === 'active')
                    }
                    disabled={!canManageServices}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
              </div>
              <label className="field">
                <span>Service intro description</span>
                <textarea
                  rows={4}
                  value={svc.description}
                  onChange={(e) => handleArrayField(setServices, services, idx, 'description', e.target.value)}
                  disabled={!canManageServices}
                />
              </label>

              <div className="service-content-sections">
                <div className="item-top">
                  <strong>Content Sections</strong>
                  <button
                    className="ghost"
                    type="button"
                    onClick={() => addServiceContentSection(idx)}
                    disabled={!canManageServices}
                  >
                    + Add section
                  </button>
                </div>

                <div className="stack">
                  {(svc.contentSections || []).map((section, sectionIndex) => (
                    <div className="item-card service-content-section-card" key={`svc-${idx}-section-${sectionIndex}`}>
                      <div className="item-top">
                        <strong>Section {sectionIndex + 1}</strong>
                        <button
                          className="link-btn"
                          type="button"
                          onClick={() => removeServiceContentSection(idx, sectionIndex)}
                          disabled={!canManageServices || (svc.contentSections || []).length <= 1}
                        >
                          Remove section
                        </button>
                      </div>

                      <div className="grid two">
                        <label className="field">
                          <span>Section image URL</span>
                          <input
                            value={section.image || ''}
                            onChange={(e) => {
                              const nextSections = [...(svc.contentSections || [])]
                              nextSections[sectionIndex] = {
                                ...(nextSections[sectionIndex] || {}),
                                image: e.target.value,
                              }
                              handleArrayField(setServices, services, idx, 'contentSections', nextSections)
                            }}
                            disabled={!canManageServices}
                            placeholder="https://..."
                          />
                        </label>
                        <label className="field">
                          <span>Upload section image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleServiceSectionImageUpload(idx, sectionIndex, e.target.files?.[0])}
                            disabled={!canManageServices}
                          />
                        </label>
                      </div>

                      {section.image && (
                        <div className="gallery-row">
                          <div className="thumbs">
                            <div className="thumb">
                              <img src={section.image} alt={`service-section-${sectionIndex + 1}`} />
                            </div>
                          </div>
                        </div>
                      )}

                      <label className="field">
                        <span>Section description</span>
                        <textarea
                          rows={3}
                          value={section.description || ''}
                          onChange={(e) => {
                            const nextSections = [...(svc.contentSections || [])]
                            nextSections[sectionIndex] = {
                              ...(nextSections[sectionIndex] || {}),
                              description: e.target.value,
                            }
                            handleArrayField(setServices, services, idx, 'contentSections', nextSections)
                          }}
                          disabled={!canManageServices}
                        />
                      </label>

                      <div className="service-bullets">
                        <div className="item-top">
                          <strong>Bullet lines</strong>
                          <button
                            className="ghost"
                            type="button"
                            onClick={() => addServiceSectionBulletPoint(idx, sectionIndex)}
                            disabled={!canManageServices}
                          >
                            + Add bullet
                          </button>
                        </div>
                        <div className="stack">
                          {(section.bulletPoints || []).map((point, bulletIndex) => (
                            <div className="service-bullet-row" key={`svc-${idx}-section-${sectionIndex}-point-${bulletIndex}`}>
                              <input
                                value={point}
                                onChange={(e) => {
                                  const nextSections = [...(svc.contentSections || [])]
                                  const currentSection = nextSections[sectionIndex] || {}
                                  const nextPoints = [...(currentSection.bulletPoints || [])]
                                  nextPoints[bulletIndex] = e.target.value
                                  nextSections[sectionIndex] = {
                                    ...currentSection,
                                    bulletPoints: nextPoints,
                                  }
                                  handleArrayField(setServices, services, idx, 'contentSections', nextSections)
                                }}
                                disabled={!canManageServices}
                              />
                              <button
                                className="link-btn"
                                type="button"
                                onClick={() => removeServiceSectionBulletPoint(idx, sectionIndex, bulletIndex)}
                                disabled={!canManageServices || (section.bulletPoints || []).length <= 1}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="service-actions">
                <button
                  className="primary"
                  type="button"
                  onClick={() => handleSaveService(svc, idx)}
                  disabled={
                    !canManageServices ||
                    savingSection === `service-${svc._id || idx}` ||
                    savingSection === `service-delete-${svc._id}`
                  }
                >
                  {savingSection === `service-${svc._id || idx}`
                    ? 'Submitting…'
                    : svc._id
                      ? 'Update Service'
                      : 'Submit Service'}
                </button>
              </div>
              </div>
            </details>
          ))}
        </div>
        <button
          className="ghost"
          type="button"
          onClick={() => addItem(setServices, emptyService)}
          disabled={!canManageServices || !serviceDraftLoaded}
        >
          + Add service
        </button>
      </div>
    ),
    hero: () => (
      <div className="section">
        <SectionHeader
          title="Hero Slides"
          cta={
            canManageServices ? (
              <button
                className="ghost"
                type="button"
                onClick={() => dispatch(fetchOwnerHeroSlides())}
                disabled={ownerHeroStatus === 'loading'}
              >
                {ownerHeroStatus === 'loading' ? 'Refreshing…' : 'Refresh'}
              </button>
            ) : null
          }
        />
        {!canManageServices && (
          <p className="muted">
            Only owner/admin accounts can add, update, or delete hero slides from this dashboard.
          </p>
        )}
        {canManageServices && (
          <p className="hint">
            Add hero image, title, and description. Home page hero look will stay same, only this content changes.
          </p>
        )}
        {canManageServices && ownerHeroError && <p className="error">{ownerHeroError}</p>}
        <div className="stack">
          {heroSlides.map((slide, idx) => (
            <details className="accordion" key={`hero-${idx}`} open={idx === 0}>
              <summary className="accordion-summary">
                <span className="accordion-title">
                  {slide._id ? `Hero Slide ${idx + 1}` : `New Hero ${idx + 1}`}
                </span>
                <span className="accordion-meta">
                  {slide.title ? slide.title : 'Untitled'}
                  {slide.isActive === false ? ' · Inactive' : ' · Active'}
                </span>
              </summary>
              <div className="item-card accordion-body">
                <div className="item-top">
                  <strong>{slide._id ? `Hero Slide ${idx + 1}` : 'New Hero Slide Draft'}</strong>
                  <button
                    className="link-btn"
                    type="button"
                    onClick={() => handleDeleteHeroSlide(slide, idx)}
                    disabled={
                      !canManageServices ||
                      savingSection === `hero-delete-${slide._id}` ||
                      savingSection === `hero-${slide._id || idx}`
                    }
                  >
                    {slide._id ? 'Delete' : 'Remove'}
                  </button>
                </div>
                <div className="grid three">
                <label className="field">
                  <span>Title</span>
                  <input
                    value={slide.title}
                    onChange={(e) => handleArrayField(setHeroSlides, heroSlides, idx, 'title', e.target.value)}
                    disabled={!canManageServices}
                  />
                </label>
                <label className="field">
                  <span>Image URL</span>
                  <input
                    value={slide.image}
                    onChange={(e) => handleArrayField(setHeroSlides, heroSlides, idx, 'image', e.target.value)}
                    disabled={!canManageServices}
                  />
                </label>
                <label className="field">
                  <span>Sort order</span>
                  <input
                    type="number"
                    value={slide.sortOrder ?? 0}
                    onChange={(e) => handleArrayField(setHeroSlides, heroSlides, idx, 'sortOrder', e.target.value)}
                    disabled={!canManageServices}
                  />
                </label>
                <label className="field">
                  <span>Status</span>
                  <select
                    value={slide.isActive === false ? 'inactive' : 'active'}
                    onChange={(e) =>
                      handleArrayField(setHeroSlides, heroSlides, idx, 'isActive', e.target.value === 'active')
                    }
                    disabled={!canManageServices}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
              </div>
              <div className="grid two">
                <label className="field">
                  <span>Upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleHeroImageUpload(idx, e.target.files?.[0])}
                    disabled={!canManageServices}
                  />
                </label>
              </div>
              <label className="field">
                <span>Description</span>
                <textarea
                  rows={3}
                  value={slide.description}
                  onChange={(e) => handleArrayField(setHeroSlides, heroSlides, idx, 'description', e.target.value)}
                  disabled={!canManageServices}
                />
              </label>
              <div className="service-actions">
                <button
                  className="primary"
                  type="button"
                  onClick={() => handleSaveHeroSlide(slide, idx)}
                  disabled={
                    !canManageServices ||
                    savingSection === `hero-${slide._id || idx}` ||
                    savingSection === `hero-delete-${slide._id}`
                  }
                >
                  {savingSection === `hero-${slide._id || idx}`
                    ? 'Submitting…'
                    : slide._id
                      ? 'Update Hero'
                      : 'Submit Hero'}
                </button>
              </div>
              </div>
            </details>
          ))}
        </div>
        <button
          className="ghost"
          type="button"
          onClick={() => addItem(setHeroSlides, emptyHeroSlide)}
          disabled={!canManageServices || !heroDraftLoaded}
        >
          + Add hero slide
        </button>
      </div>
    ),
    ownerProjects: () => (
      <div className="section">
        <SectionHeader
          title="Projects"
          cta={
            canManageServices ? (
              <button
                className="ghost"
                type="button"
                onClick={() => dispatch(fetchOwnerProjects())}
                disabled={ownerProjectsStatus === 'loading'}
              >
                {ownerProjectsStatus === 'loading' ? 'Refreshing…' : 'Refresh'}
              </button>
            ) : null
          }
        />
        {!canManageServices && (
          <p className="muted">
            Only owner/admin accounts can add, update, or delete projects from this dashboard.
          </p>
        )}
        {canManageServices && (
          <p className="hint">
            Add project name, type, link, details, technologies, display order, and current status to publish project cards on website.
          </p>
        )}
        {canManageServices && ownerProjectsError && <p className="error">{ownerProjectsError}</p>}
        <div className="stack">
          {ownerProjects.map((project, idx) => (
            <details className="accordion" key={`owner-project-${idx}`} open={idx === 0}>
              <summary className="accordion-summary">
                <span className="accordion-title">
                  {project._id ? `Project ${idx + 1}` : `New Project ${idx + 1}`}
                </span>
                <span className="accordion-meta">
                  {project.name ? project.name : 'Untitled'}
                  {project.status === 'delivered' ? ' · Delivered' : ' · Live'}
                </span>
              </summary>
              <div className="item-card accordion-body">
                <div className="item-top">
                  <strong>{project._id ? `Project ${idx + 1}` : 'New Project Draft'}</strong>
                  <button
                    className="link-btn"
                    type="button"
                    onClick={() => handleDeleteOwnerProject(project, idx)}
                    disabled={
                      !canManageServices ||
                      savingSection === `owner-project-delete-${project._id}` ||
                      savingSection === `owner-project-${project._id || idx}`
                    }
                  >
                    {project._id ? 'Delete' : 'Remove'}
                  </button>
                </div>
                <div className="grid two">
                  <label className="field">
                    <span>Project name</span>
                    <input
                      value={project.name}
                      onChange={(e) => handleArrayField(setOwnerProjects, ownerProjects, idx, 'name', e.target.value)}
                      disabled={!canManageServices}
                    />
                  </label>
                  <label className="field">
                    <span>Project type</span>
                    <input
                      value={project.type}
                      onChange={(e) => handleArrayField(setOwnerProjects, ownerProjects, idx, 'type', e.target.value)}
                      disabled={!canManageServices}
                    />
                  </label>
                </div>
                <div className="grid two">
                  <label className="field">
                    <span>Project link</span>
                    <input
                      type="url"
                      value={project.link}
                      onChange={(e) => handleArrayField(setOwnerProjects, ownerProjects, idx, 'link', e.target.value)}
                      placeholder="https://example.com"
                      disabled={!canManageServices}
                    />
                  </label>
                  <label className="field">
                    <span>Status</span>
                    <select
                      value={project.status === 'delivered' ? 'delivered' : 'live'}
                      onChange={(e) =>
                        handleArrayField(setOwnerProjects, ownerProjects, idx, 'status', e.target.value)
                      }
                      disabled={!canManageServices}
                    >
                      <option value="live">Live</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </label>
                </div>
                <label className="field">
                  <span>Project details</span>
                  <textarea
                    rows={4}
                    value={project.details || ''}
                    onChange={(e) =>
                      handleArrayField(setOwnerProjects, ownerProjects, idx, 'details', e.target.value)
                    }
                    placeholder="Short summary about this project"
                    disabled={!canManageServices}
                  />
                </label>
                <label className="field">
                  <span>Technologies (comma separated)</span>
                  <input
                    value={project.technologiesInput ?? (project.technologies || []).join(', ')}
                    onChange={(e) =>
                      handleArrayField(setOwnerProjects, ownerProjects, idx, 'technologiesInput', e.target.value)
                    }
                    placeholder="React, Node.js, MongoDB, Razorpay"
                    disabled={!canManageServices}
                  />
                </label>
                <label className="field">
                  <span>Display order (smaller number shows first)</span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={project.sortOrder}
                    onChange={(e) =>
                      handleArrayField(setOwnerProjects, ownerProjects, idx, 'sortOrder', e.target.value)
                    }
                    placeholder="1"
                    disabled={!canManageServices}
                  />
                </label>
                <div className="service-actions">
                  <button
                    className="primary"
                    type="button"
                    onClick={() => handleSaveOwnerProject(project, idx)}
                    disabled={
                      !canManageServices ||
                      savingSection === `owner-project-${project._id || idx}` ||
                      savingSection === `owner-project-delete-${project._id}`
                    }
                  >
                    {savingSection === `owner-project-${project._id || idx}`
                      ? 'Submitting…'
                      : project._id
                        ? 'Update Project'
                        : 'Submit Project'}
                  </button>
                </div>
              </div>
            </details>
          ))}
        </div>
        <button
          className="ghost"
          type="button"
          onClick={() => addItem(setOwnerProjects, emptyOwnerProject)}
          disabled={!canManageServices || !ownerProjectDraftLoaded}
        >
          + Add project
        </button>
      </div>
    ),
    consultations: () => <ConsultationsPanel />,
    users: () => (
      <div className="section">
        <SectionHeader
          title="User Management"
          cta={
            <button
              className="ghost"
              type="button"
              onClick={() => dispatch(fetchManagedUsers())}
              disabled={!isOwner || managedUsersStatus === 'loading'}
            >
              {managedUsersStatus === 'loading' ? 'Refreshing…' : 'Refresh'}
            </button>
          }
        />
        {!isOwner && (
          <p className="muted">Only owner account can access user management.</p>
        )}
        {isOwner && managedUsersError && <p className="error">{managedUsersError}</p>}
        {isOwner && (
          <div className="stack">
            <p className="hint">
              Manage partner/admin accounts from here. Owner account is protected and cannot be deactivated or deleted.
            </p>
            {managedUsers.map((managedUser) => (
              <div className="item-card" key={managedUser.id}>
                {(() => {
                  const isSelf = managedUser.id === user?.id
                  const isOwnerAccount = managedUser.role === 'owner'
                  const isProtected = isSelf || isOwnerAccount
                  const approvalStatus = managedUser.approvalStatus || 'approved'
                  const isPending = approvalStatus === 'pending'

                  return (
                    <>
                <div className="item-top">
                  <div>
                    <strong>{managedUser.fullName || 'Unnamed user'}</strong>
                    <p className="muted" style={{ marginTop: 4 }}>
                      Mobile: {managedUser.mobile || '—'} {managedUser.email ? `· ${managedUser.email}` : ''}
                    </p>
                  </div>
                  <div className="item-actions">
                    <span className="badge">{managedUser.role || 'partner'}</span>
                    <span className="badge">{approvalStatus}</span>
                    <span className={`badge ${managedUser.isActive === false ? 'inactive' : ''}`}>
                      {managedUser.isActive === false ? 'Inactive' : 'Active'}
                    </span>
                    {isProtected && <span className="badge">Protected</span>}
                  </div>
                </div>
                {isPending && (
                  <div className="service-actions user-actions">
                    <button
                      className="primary"
                      type="button"
                      onClick={() => handleUpdateUserApproval(managedUser, 'approved')}
                      disabled={savingSection === `user-approval-${managedUser.id}-approved`}
                    >
                      {savingSection === `user-approval-${managedUser.id}-approved`
                        ? 'Approving…'
                        : 'Approve Request'}
                    </button>
                    <button
                      className="ghost"
                      type="button"
                      onClick={() => handleUpdateUserApproval(managedUser, 'rejected')}
                      disabled={savingSection === `user-approval-${managedUser.id}-rejected`}
                    >
                      {savingSection === `user-approval-${managedUser.id}-rejected`
                        ? 'Rejecting…'
                        : 'Reject Request'}
                    </button>
                  </div>
                )}
                <div className="service-actions user-actions">
                  {!isOwnerAccount && (
                    <div className="user-password-row">
                      <input
                        type={showUserPasswords[managedUser.id] ? 'text' : 'password'}
                        value={userPasswordDrafts[managedUser.id] || ''}
                        onChange={(e) =>
                          setManagedUserPasswordDraft(managedUser.id, e.target.value)
                        }
                        placeholder="Set new password"
                        disabled={savingSection === `user-password-${managedUser.id}`}
                      />
                      <button
                        className="ghost"
                        type="button"
                        onClick={() => toggleManagedUserPasswordVisibility(managedUser.id)}
                      >
                        {showUserPasswords[managedUser.id] ? '🙈' : '👁'}
                      </button>
                      <button
                        className="primary"
                        type="button"
                        onClick={() => handleResetManagedUserPassword(managedUser)}
                        disabled={savingSection === `user-password-${managedUser.id}`}
                      >
                        {savingSection === `user-password-${managedUser.id}`
                          ? 'Resetting…'
                          : 'Reset Password'}
                      </button>
                    </div>
                  )}
                  <button
                    className="ghost"
                    type="button"
                    onClick={() => handleToggleUserStatus(managedUser)}
                    disabled={
                      isPending ||
                      isProtected ||
                      savingSection === `user-status-${managedUser.id}`
                    }
                  >
                    {savingSection === `user-status-${managedUser.id}`
                      ? 'Updating…'
                      : managedUser.isActive === false
                        ? 'Activate User'
                        : 'Deactivate User'}
                  </button>
                  <button
                    className="link-btn danger"
                    type="button"
                    onClick={() => handleDeleteUser(managedUser)}
                    disabled={
                      isProtected ||
                      savingSection === `user-delete-${managedUser.id}`
                    }
                  >
                    {savingSection === `user-delete-${managedUser.id}` ? 'Deleting…' : 'Delete User'}
                  </button>
                </div>
                {isProtected && (
                  <p className="muted user-note">
                    {isSelf ? 'This is your current account.' : 'Owner account cannot be modified.'}
                  </p>
                )}
                {!isProtected && isPending && (
                  <p className="muted user-note">Approve this request first, then user can access dashboard.</p>
                )}
                    </>
                  )
                })()}
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    socials: () => (
      <div className="section">
        <SectionHeader
          title="Social snapshots"
          cta={
            <button
              className="primary"
              type="button"
              onClick={() => handleSaveSection('socials')}
              disabled={savingSection === 'socials'}
            >
              {savingSection === 'socials' ? 'Saving…' : 'Save Socials'}
            </button>
          }
        />
        <div className="stack">
          {socials.map((soc, idx) => (
            <div className="item-card" key={`soc-${idx}`}>
              <div className="item-top">
                <strong>Social {idx + 1}</strong>
                <button
                  className="link-btn"
                  type="button"
                  onClick={() => removeItem(setSocials, socials, idx)}
                  disabled={socials.length === 1}
                >
                  Remove
                </button>
              </div>
              <div className="grid two">
                <label className="field">
                  <span>Platform</span>
                  <select
                    value={soc.platform}
                    onChange={(e) => handleArrayField(setSocials, socials, idx, 'platform', e.target.value)}
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="github">GitHub</option>
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="dribbble">Dribbble</option>
                    <option value="behance">Behance</option>
                    <option value="facebook">Facebook</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label className="field">
                  <span>Handle</span>
                  <input
                    value={soc.handle}
                    onChange={(e) => handleArrayField(setSocials, socials, idx, 'handle', e.target.value)}
                  />
                </label>
              </div>
              <div className="grid two">
                <label className="field">
                  <span>Profile URL</span>
                  <input
                    value={soc.url}
                    onChange={(e) => handleArrayField(setSocials, socials, idx, 'url', e.target.value)}
                  />
                </label>
                <label className="field">
                  <span>Followers</span>
                  <input
                    type="number"
                    value={soc.followers}
                    onChange={(e) => handleArrayField(setSocials, socials, idx, 'followers', e.target.value)}
                  />
                </label>
              </div>
              <div className="grid two">
                <label className="field">
                  <span>Impressions (30d)</span>
                  <input
                    type="number"
                    value={soc.impressionsLast30}
                    onChange={(e) => handleArrayField(setSocials, socials, idx, 'impressionsLast30', e.target.value)}
                  />
                </label>
                <label className="field">
                  <span>Engagement %</span>
                  <input
                    type="number"
                    value={soc.engagementRate}
                    onChange={(e) => handleArrayField(setSocials, socials, idx, 'engagementRate', e.target.value)}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
        <button className="ghost" type="button" onClick={() => addItem(setSocials, emptySocial)}>
          + Add social profile
        </button>
      </div>
    ),
    contact: () => (
      <div className="section">
        <SectionHeader
          title="Contact"
          cta={
            <button
              className="primary"
              type="button"
              onClick={() => handleSaveSection('contact')}
              disabled={savingSection === 'contact'}
            >
              {savingSection === 'contact' ? 'Saving…' : 'Save Contact'}
            </button>
          }
        />
        <div className="grid two">
          <label className="field">
            <span>Email</span>
            <input
              value={contact.email}
              onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
            />
          </label>
          <label className="field">
            <span>Phone</span>
            <input
              value={contact.phone}
              onChange={(e) => setContact((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </label>
        </div>
        <div className="grid two">
          <label className="field">
            <span>Website</span>
            <input
              value={contact.website}
              onChange={(e) => setContact((prev) => ({ ...prev, website: e.target.value }))}
            />
          </label>
          <label className="field">
            <span>Address</span>
            <input
              value={contact.address}
              onChange={(e) => setContact((prev) => ({ ...prev, address: e.target.value }))}
            />
          </label>
        </div>
        <div className="grid two">
          <label className="field">
            <span>LinkedIn</span>
            <input
              value={contact.linkedin}
              onChange={(e) => setContact((prev) => ({ ...prev, linkedin: e.target.value }))}
            />
          </label>
          <label className="field">
            <span>GitHub</span>
            <input
              value={contact.github}
              onChange={(e) => setContact((prev) => ({ ...prev, github: e.target.value }))}
            />
          </label>
        </div>
        <div className="grid two">
          <label className="field">
            <span>Twitter</span>
            <input
              value={contact.twitter}
              onChange={(e) => setContact((prev) => ({ ...prev, twitter: e.target.value }))}
            />
          </label>
          <label className="field">
            <span>Dribbble</span>
            <input
              value={contact.dribbble}
              onChange={(e) => setContact((prev) => ({ ...prev, dribbble: e.target.value }))}
            />
          </label>
        </div>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={isFreelanceOpen}
            onChange={(e) => setIsFreelanceOpen(e.target.checked)}
          />
          <span>Freelance inquiries open</span>
        </label>
      </div>
    ),
  }
}
