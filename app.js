// Course Status Dashboard - Dynamic Rendering Engine
// Phase 2: Load courses from JSON and render dynamically

class CourseDashboard {
    constructor() {
        this.coursesData = null;
        this.editMode = localStorage.getItem('edit-mode') === 'true';
        this.githubToken = localStorage.getItem('github-token') || '';
        this.init();
    }

    async init() {
        console.log('Course Dashboard initializing...');

        // Load course data
        await this.loadCourseData();

        // Apply edit mode and render courses
        this.refreshEditMode();

        // Set up event listeners
        this.setupEventListeners();

        console.log('Course Dashboard ready');
    }

    async loadCourseData() {
        try {
            // Clear any stale localStorage cache
            localStorage.removeItem('courses-data');

            // Always load fresh from JSON file (skip localStorage caching)
            const response = await fetch('courses.json?t=' + Date.now());
            if (!response.ok) {
                throw new Error(`Failed to load courses.json: ${response.status}`);
            }

            this.coursesData = await response.json();
            console.log('Loaded courses from courses.json');

            // Ensure data has all required fields
            this.migrateData();

            // Do NOT save to localStorage to prevent stale cache
            // localStorage.setItem('courses-data', JSON.stringify(this.coursesData));

        } catch (error) {
            console.error('Error loading course data:', error);
            this.showNotification('Failed to load course data. Using fallback.', 'error');
            // Fallback: Keep hardcoded HTML (it will remain visible)
        }
    }

    migrateData() {
        if (!this.coursesData || !this.coursesData.sections) return;

        // Ensure each course has iframeUrl field (for backward compatibility)
        this.coursesData.sections.forEach(section => {
            section.courses.forEach(course => {
                if (course.iframeUrl === undefined) {
                    course.iframeUrl = '';
                }
            });
        });

        console.log('Data migration completed');
    }

    renderCourses() {
        if (!this.coursesData || !this.coursesData.sections) {
            console.error('No course data to render');
            return;
        }

        const container = document.getElementById('courses-container');
        if (!container) {
            console.error('Courses container not found');
            return;
        }

        // Clear container
        container.innerHTML = '';

        // Render each section
        this.coursesData.sections.forEach(section => {
            const sectionElement = this.createSectionElement(section);
            container.appendChild(sectionElement);
        });

        // Apply password protection for second rollout
        this.applyPasswordProtection();

        // Update statistics
        this.updateStats();
    }

    createSectionElement(section) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'courses-section';

        // Set ID for second rollout section for password protection
        if (section.id === 'second-rollout') {
            sectionDiv.id = 'secondRolloutSection';
            sectionDiv.style.display = 'none'; // Hidden by default
        }

        // Section title
        const titleHTML = `
            <h2 class="section-title">
                ${section.title}
                <span class="status-badge">${section.description}</span>
            </h2>
            <div class="courses-grid"></div>
        `;

        sectionDiv.innerHTML = titleHTML;

        // Get grid container
        const grid = sectionDiv.querySelector('.courses-grid');

        // Render each course in this section
        section.courses.forEach(course => {
            const courseCard = this.createCourseCard(course);
            grid.appendChild(courseCard);
        });

        return sectionDiv;
    }

    createCourseCard(course) {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.dataset.courseId = course.id;

        // Add incomplete class if status is "In Development"
        if (course.status === 'In Development') {
            card.classList.add('incomplete');
        }

        // Determine status class based on status
        let statusClass = 'status-pending';
        let statusText = course.status;

        if (course.status === 'Available') {
            statusClass = 'status-complete';
        } else if (course.status === 'Feedback Complete') {
            statusClass = 'status-completed';
        } else if (course.status === 'Feedback Phase') {
            statusClass = 'status-feedback';
        } else if (course.status === 'In Development') {
            statusClass = 'status-pending';
        }

        // Course link or placeholder
        let courseLinkHTML = '';
        if (course.coassembleUrl) {
            courseLinkHTML = `<a href="${course.coassembleUrl}" target="_blank" class="course-link">${course.title}</a>`;
        } else {
            courseLinkHTML = `<div class="course-link course-placeholder">${course.title}</div>`;
        }

        // Translation items (including practice exercises)
        const translationItems = this.createTranslationItems(course);

        // Iframe status (new feature)
        const iframeStatus = this.createIframeStatus(course);

        // Build card HTML
        card.innerHTML = `
            <div class="course-header">
                <span class="course-number">${course.number}</span>
                <span class="course-status ${statusClass}">${statusText}</span>
            </div>
            ${courseLinkHTML}
            <div class="translation-status">
                ${translationItems}
            </div>
            ${iframeStatus}
        `;

        return card;
    }

    createTranslationItems(course) {
        const languages = [
            { key: 'french', label: 'French' },
            { key: 'english', label: 'English' },
            { key: 'arabic', label: 'Arabic' },
            { key: 'practice', label: 'Practice' }
        ];

        let itemsHTML = '';

        languages.forEach(lang => {
            let available = false;
            let url = '';
            let title = '';

            if (lang.key === 'practice') {
                // Handle practice exercises
                url = course.practiceExerciseUrl || '';
                available = url.trim() !== '';
                title = this.editMode ? 'Click to edit practice exercise URL' :
                        available ? 'View practice exercises' : 'No practice exercises available';
            } else {
                // Handle language translations
                const translation = course.translations[lang.key];
                available = translation.available;
                url = translation.url || '';
                title = this.editMode ? 'Click to edit translation URL' :
                        available ? 'View translation' : 'No translation available';
            }

            const indicatorClass = available ? 'lang-complete' : 'lang-pending';
            const symbol = available ? '✓' : '✗';

            // Make link clickable if URL exists, always add data attributes for editing
            let linkHTML = '';
            if (url) {
                linkHTML = `<a href="${url}" target="_blank" class="translation-link" data-course-id="${course.id}" data-language="${lang.key}" title="${title}">${lang.label} ${symbol}</a>`;
            } else {
                linkHTML = `<a href="#" class="translation-link no-url" data-course-id="${course.id}" data-language="${lang.key}" title="${title}">${lang.label} ${symbol}</a>`;
            }

            itemsHTML += `
                <div class="translation-item">
                    <div class="translation-indicator ${indicatorClass}"></div>
                    ${linkHTML}
                </div>
            `;
        });

        return itemsHTML;
    }


    createIframeStatus(course) {
        const added = course.iframeInPlatform;
        const indicatorClass = added ? 'iframe-added' : 'iframe-not-added';
        const symbol = added ? '✓' : '✗';
        const url = course.iframeUrl || '';
        const hasUrl = url.trim() !== '';

        // Determine title/tooltip
        let title = '';
        if (this.editMode) {
            title = 'Click to edit iframe platform URL';
        } else if (hasUrl) {
            title = 'Open iframe platform link';
        } else {
            title = 'No platform link available';
        }

        // Create label as link if URL exists, otherwise as span
        let labelHTML = '';
        if (hasUrl) {
            labelHTML = `<a href="${url}" target="_blank" class="iframe-label iframe-link" data-course-id="${course.id}" title="${title}">Iframe added to platform ${symbol}</a>`;
        } else {
            labelHTML = `<a href="#" class="iframe-label iframe-link no-url" data-course-id="${course.id}" title="${title}">Iframe added to platform ${symbol}</a>`;
        }

        return `
            <div class="iframe-status">
                <div class="iframe-item">
                    <div class="iframe-indicator ${indicatorClass}" data-course-id="${course.id}" title="Click to toggle iframe status"></div>
                    ${labelHTML}
                </div>
            </div>
        `;
    }

    applyPasswordProtection() {
        // Re-initialize password protection for second rollout section
        const passwordInput = document.getElementById('passwordInput');
        const settingsModal = document.getElementById('settingsModal');

        if (passwordInput && settingsModal) {
            // Update the existing checkPassword function to show second rollout
            // The existing JavaScript in index.html already handles this
            // We just need to ensure the section exists and has correct ID
            console.log('Password protection applied to dynamically rendered section');
        }
    }

    setupEventListeners() {
        // Iframe indicator click handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('iframe-indicator')) {
                this.handleIframeIndicatorClick(e.target);
            }
        });

        // Translation link click handlers (including practice exercises)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('translation-link')) {
                if (this.editMode) {
                    e.preventDefault();
                    const courseId = e.target.dataset.courseId;
                    const language = e.target.dataset.language;
                    const href = e.target.getAttribute('href');
                    const currentUrl = href && href !== '#' ? href : '';

                    if (language === 'practice') {
                        this.editPracticeExerciseUrl(courseId, currentUrl);
                    } else {
                        this.editTranslationUrl(courseId, language, currentUrl);
                    }
                } else {
                    // Not in edit mode - check if link has no URL
                    const href = e.target.getAttribute('href');
                    if (!href || href === '#') {
                        e.preventDefault();
                        const language = e.target.dataset.language;
                        const message = language === 'practice'
                            ? 'Practice exercises are not available yet.'
                            : `${language.charAt(0).toUpperCase() + language.slice(1)} translation is not available yet.`;
                        if (typeof showAlertModal === 'function') {
                            showAlertModal('Translation Not Available', message);
                        } else {
                            alert(message);
                        }
                    }
                }
                // Otherwise, allow default link behavior
            }
        });


        // Iframe link click handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('iframe-link')) {
                if (this.editMode) {
                    e.preventDefault();
                    const courseId = e.target.dataset.courseId;
                    const href = e.target.getAttribute('href');
                    const currentUrl = href && href !== '#' ? href : '';
                    this.editIframeUrl(courseId, currentUrl);
                } else {
                    // Not in edit mode - check if link has no URL
                    const href = e.target.getAttribute('href');
                    if (!href || href === '#') {
                        e.preventDefault();
                        if (typeof showAlertModal === 'function') {
                            showAlertModal('Iframe Link Not Available', 'Iframe platform link is not available yet.');
                        } else {
                            alert('Iframe platform link is not available yet.');
                        }
                    }
                }
                // Otherwise, allow default link behavior
            }
        });

        // Status badge click handlers for editing
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('course-status')) {
                if (this.editMode) {
                    e.preventDefault();
                    const card = e.target.closest('.course-card');
                    if (card) {
                        const courseId = card.dataset.courseId;
                        const currentStatus = e.target.textContent;
                        this.editCourseStatus(courseId, currentStatus);
                    }
                }
                // Otherwise, allow default behavior
            }
        });
    }

    handleIframeIndicatorClick(indicator) {
        const courseId = indicator.dataset.courseId;

        // Get current state and toggle
        let currentState = false;
        for (const section of this.coursesData.sections) {
            for (const course of section.courses) {
                if (course.id === courseId) {
                    currentState = course.iframeInPlatform || false;
                    break;
                }
            }
        }

        const newState = !currentState;

        // Update in-memory data
        this.updateCourseField(courseId, 'iframeInPlatform', newState);

        // Save to localStorage
        this.saveToLocalStorage();

        // Update visual indicator
        indicator.classList.toggle('iframe-added', newState);
        indicator.classList.toggle('iframe-not-added', !newState);

        // Update label text
        const label = indicator.closest('.iframe-item').querySelector('.iframe-label');
        if (label) {
            const symbol = newState ? '✓' : '✗';
            label.textContent = `Iframe added to platform ${symbol}`;
        }

        console.log(`Updated iframe status for ${courseId}: ${newState}`);
    }

    updateCourseField(courseId, field, value) {
        if (!this.coursesData) return;

        for (const section of this.coursesData.sections) {
            for (const course of section.courses) {
                if (course.id === courseId) {
                    course[field] = value;
                    return true;
                }
            }
        }
        return false;
    }

    saveToLocalStorage() {
        if (this.coursesData) {
            localStorage.setItem('courses-data', JSON.stringify(this.coursesData));
            localStorage.setItem('last-save-time', new Date().toISOString());
        }
    }

    setGitHubToken(token) {
        this.githubToken = token;
        localStorage.setItem('github-token', token);
        this.showNotification('GitHub token saved', 'success');
    }

    async loadFromGitHub() {
        if (!this.githubToken) {
            this.showNotification('Please set GitHub token first', 'error');
            return false;
        }
        try {
            const response = await fetch('https://api.github.com/repos/youssefbarj/Course-Status/contents/courses.json', {
                headers: {
                    'Authorization': 'token ' + this.githubToken,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (!response.ok) {
                throw new Error('GitHub API error: ' + response.status);
            }
            const data = await response.json();
            const content = atob(data.content);
            const remoteData = JSON.parse(content);
            this.coursesData = remoteData;
            this.saveToLocalStorage();
            this.renderCourses();
            this.showNotification('Courses loaded from GitHub', 'success');
            return true;
        } catch (error) {
            console.error('Failed to load from GitHub:', error);
            this.showNotification('Failed to load from GitHub', 'error');
            return false;
        }
    }

    async saveToGitHub() {
        if (!this.githubToken) {
            this.showNotification('Please set GitHub token first', 'error');
            return false;
        }
        if (!this.coursesData) {
            this.showNotification('No course data to save', 'error');
            return false;
        }
        try {
            // First get current SHA to update
            const getResponse = await fetch('https://api.github.com/repos/youssefbarj/Course-Status/contents/courses.json', {
                headers: {
                    'Authorization': 'token ' + this.githubToken,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            let sha = null;
            if (getResponse.ok) {
                const data = await getResponse.json();
                sha = data.sha;
            }
            const content = btoa(JSON.stringify(this.coursesData, null, 2));
            const payload = {
                message: 'Update courses.json via dashboard ' + new Date().toISOString(),
                content: content,
                sha: sha
            };
            const response = await fetch('https://api.github.com/repos/youssefbarj/Course-Status/contents/courses.json', {
                method: 'PUT',
                headers: {
                    'Authorization': 'token ' + this.githubToken,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error('GitHub API error: ' + response.status);
            }
            this.showNotification('Courses saved to GitHub', 'success');
            return true;
        } catch (error) {
            console.error('Failed to save to GitHub:', error);
            this.showNotification('Failed to save to GitHub', 'error');
            return false;
        }
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
        localStorage.setItem('edit-mode', this.editMode);
        this.refreshEditMode();
        this.showNotification('Edit mode ' + (this.editMode ? 'enabled' : 'disabled'));
    }

    syncEditModeCheckbox() {
        const checkbox = document.getElementById('editModeCheckbox');
        if (checkbox) {
            checkbox.checked = this.editMode;
        }
    }

    refreshEditMode() {
        document.body.classList.toggle('edit-mode', this.editMode);
        this.syncEditModeCheckbox();
        this.renderCourses();
    }

    updateStats() {
        if (!this.coursesData) return;
        console.log('updateStats called', this.coursesData.sections.length);
        let totalCourses = 0;
        let feedbackPhaseCount = 0;
        let feedbackCompleteCount = 0;
        let coursesInDevelopment = 0;
        let translationsNeeded = 0;
        let iframeAdded = 0;

        this.coursesData.sections.forEach(section => {
            const sectionCount = section.courses.length;
            totalCourses += sectionCount;

            // Count by status and iframe
            section.courses.forEach(course => {
                // Count by status
                if (course.status === 'Feedback Phase') {
                    feedbackPhaseCount++;
                } else if (course.status === 'Feedback Complete' || course.status === 'Available') {
                    feedbackCompleteCount++;
                } else if (course.status === 'In Development') {
                    coursesInDevelopment++;
                }

                // Count iframe added
                if (course.iframeInPlatform === true) {
                    iframeAdded++;
                }

                // Count translations needed
                Object.values(course.translations).forEach(trans => {
                    if (!trans.available) translationsNeeded++;
                });
            });
        });
        console.log('Stats computed:', { totalCourses, feedbackPhaseCount, feedbackCompleteCount, coursesInDevelopment, iframeAdded, translationsNeeded });

        // Update DOM
        const setText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };
        setText('total-courses', totalCourses);
        setText('courses-in-feedback', feedbackPhaseCount);
        setText('feedback-complete', feedbackCompleteCount);
        setText('courses-in-development', coursesInDevelopment);
        setText('iframe-added', iframeAdded);

        // Calculate and update translation progress
        const totalPossibleTranslations = totalCourses * 3; // 3 languages per course
        const translationsCompleted = totalPossibleTranslations - translationsNeeded;
        const translationPercentage = totalPossibleTranslations > 0
            ? Math.round((translationsCompleted / totalPossibleTranslations) * 100)
            : 0;

        const translationNumberEl = document.getElementById('translations-needed');
        const translationLabelEl = translationNumberEl?.closest('.stat-card')?.querySelector('.stat-label');

        if (translationNumberEl) {
            translationNumberEl.textContent = `${translationPercentage}%`;
            translationNumberEl.title = `${translationsCompleted}/${totalPossibleTranslations} translations complete`;
        }
        if (translationLabelEl) {
            translationLabelEl.textContent = 'Translation Progress';
        }
    }

    editTranslationUrl(courseId, language, currentUrl) {
        const newUrl = prompt('Enter ' + language + ' translation URL for course ' + courseId + ':', currentUrl || '');
        if (newUrl !== null) {
            this.updateCourseTranslationUrl(courseId, language, newUrl);
        }
    }

    updateCourseTranslationUrl(courseId, language, url) {
        if (!this.coursesData) return false;
        for (const section of this.coursesData.sections) {
            for (const course of section.courses) {
                if (course.id === courseId) {
                    course.translations[language].url = url;
                    course.translations[language].available = !!url;
                    this.saveToLocalStorage();
                    this.renderCourses();
                    return true;
                }
            }
        }
        return false;
    }

    editPracticeExerciseUrl(courseId, currentUrl) {
        const newUrl = prompt('Enter practice exercise URL for course ' + courseId + ':', currentUrl || '');
        if (newUrl !== null) {
            this.updatePracticeExerciseUrl(courseId, newUrl);
        }
    }

    updatePracticeExerciseUrl(courseId, url) {
        if (!this.coursesData) return false;
        for (const section of this.coursesData.sections) {
            for (const course of section.courses) {
                if (course.id === courseId) {
                    course.practiceExerciseUrl = url;
                    this.saveToLocalStorage();
                    this.renderCourses();
                    return true;
                }
            }
        }
        return false;
    }

    editIframeUrl(courseId, currentUrl) {
        const newUrl = prompt('Enter iframe platform URL for course ' + courseId + ':', currentUrl || '');
        if (newUrl !== null) {
            this.updateIframeUrl(courseId, newUrl);
        }
    }

    updateIframeUrl(courseId, url) {
        if (!this.coursesData) return false;
        for (const section of this.coursesData.sections) {
            for (const course of section.courses) {
                if (course.id === courseId) {
                    course.iframeUrl = url;
                    this.saveToLocalStorage();
                    this.renderCourses();
                    return true;
                }
            }
        }
        return false;
    }

    editCourseStatus(courseId, currentStatus) {
        const validStatuses = ['Available', 'Feedback Complete', 'Feedback Phase', 'In Development'];
        const newStatus = prompt(`Enter new status for course ${courseId}:\n\nValid values: ${validStatuses.join(', ')}`, currentStatus);
        if (newStatus !== null && validStatuses.includes(newStatus)) {
            this.updateCourseField(courseId, 'status', newStatus);
            this.saveToLocalStorage();
            this.renderCourses();
            return true;
        } else if (newStatus !== null) {
            if (typeof showAlertModal === 'function') {
                showAlertModal('Invalid Status', `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
            } else {
                alert(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
            }
        }
        return false;
    }

    showNotification(message, type = 'info') {
        // Use existing notification function if available
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                font-size: 16px;
                z-index: 3000;
                animation: fadeInOut 2s ease-in-out;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 2000);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.courseDashboard = new CourseDashboard();
});