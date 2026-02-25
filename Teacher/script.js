// Page switching function
function switchPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update sidebar active state
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Find and activate the correct sidebar item (based on the pageId)
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        if (item.getAttribute('onclick')?.includes(pageId)) {
            item.classList.add('active');
        }
    });
}

// Toast notification function
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    const container = document.getElementById('toast-container');
    container.innerHTML = ''; // Clear existing toasts
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Modal functions
function openMeetingModal(className) {
    document.getElementById('meeting-title').textContent = `Class Meeting - ${className}`;
    document.getElementById('meeting-modal').classList.add('active');
}

function closeMeetingModal() {
    document.getElementById('meeting-modal').classList.remove('active');
}

function openAddAdvisoryModal() {
    document.getElementById('add-advisory-modal').classList.add('active');
}

function closeAddAdvisoryModal() {
    document.getElementById('add-advisory-modal').classList.remove('active');
}

function openCreateLessonModal() {
    document.getElementById('create-lesson-modal').classList.add('active');
}

function closeCreateLessonModal() {
    document.getElementById('create-lesson-modal').classList.remove('active');
}

function openUploadQuizModal() {
    document.getElementById('upload-quiz-modal').classList.add('active');
}

function closeUploadQuizModal() {
    document.getElementById('upload-quiz-modal').classList.remove('active');
}

function openAddGradeModal() {
    document.getElementById('add-grade-modal').classList.add('active');
}

function closeAddGradeModal() {
    document.getElementById('add-grade-modal').classList.remove('active');
}

function openEditProfileModal() {
    document.getElementById('edit-profile-modal').classList.add('active');
}

function closeEditProfileModal() {
    document.getElementById('edit-profile-modal').classList.remove('active');
}

// Save functions (placeholder - add your logic here)
function saveAdvisory() {
    showToast('✓ Advisory record saved successfully', 'success');
    closeAddAdvisoryModal();
}

function saveLessonPlan() {
    showToast('✓ Lesson plan created successfully', 'success');
    closeCreateLessonModal();
}

function publishQuiz() {
    showToast('✓ Quiz published successfully', 'success');
    closeUploadQuizModal();
}

function saveGrade() {
    showToast('✓ Grade added successfully', 'success');
    closeAddGradeModal();
}

function updateProfile() {
    showToast('✓ Profile updated successfully', 'success');
    closeEditProfileModal();
}

// Question field for quiz modal
let questionCount = 0;

function addQuestionField() {
    questionCount++;
    const container = document.getElementById('questions-container');
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.innerHTML = `
        <div class="question-item-header">
            <span class="question-type-badge">Question ${questionCount}</span>
            <button class="text-red-600 text-sm" onclick="this.closest('.question-item').remove()">✕ Remove</button>
        </div>
        <div class="form-group">
            <input type="text" class="form-input" placeholder="Enter question">
        </div>
        <div class="grid grid-cols-2 gap-2">
            <input type="text" class="form-input" placeholder="Option A">
            <input type="text" class="form-input" placeholder="Option B">
            <input type="text" class="form-input" placeholder="Option C">
            <input type="text" class="form-input" placeholder="Option D">
        </div>
        <div class="form-group mt-2">
            <select class="form-select">
                <option>Correct Answer: A</option>
                <option>Correct Answer: B</option>
                <option>Correct Answer: C</option>
                <option>Correct Answer: D</option>
            </select>
        </div>
    `;
    
    container.appendChild(questionDiv);
}

// Grade functions
function openEditGradeModal(id) {
    showToast(`✏️ Editing grade #${id}`, 'info');
    // Add your edit logic here
}

function deleteGrade(id) {
    if (confirm('Are you sure you want to delete this grade?')) {
        showToast(`✓ Grade #${id} deleted`, 'success');
    }
}

// Advisory functions
function openEditAdvisoryModal(id) {
    showToast(`✏️ Editing advisory #${id}`, 'info');
    openAddAdvisoryModal();
}

function deleteAdvisory(id) {
    if (confirm('Are you sure you want to delete this advisory record?')) {
        showToast(`✓ Advisory #${id} deleted`, 'success');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Make sure dashboard is active
    switchPage('dashboard');
    
    // Add click outside to close modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
});