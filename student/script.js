// Configuration
const defaultConfig = {
    system_name: 'E-learn',
    welcome_message: 'Welcome back!',
    primary_color: '#1976d2',
    secondary_color: '#e3f2fd',
    accent_color: '#bbdefb',
    text_color: '#1f2937',
    background_color: '#f9fafb'
};

// State
let currentView = 'dashboard';
let isPaid = false;
let hasExamPermit = false;
let studentType = 'block';
let enrolledData = [];
let selectedSlot = null;

// Available subjects for non-block enrollment
const availableSubjects = [
    { code: 'IT 102', name: 'Computer Programming 1', units: 3, prereq: 'IT 101', schedule: 'MWF 8:00-9:30 AM', room: '302', instructor: 'Prof. Ramos', available: true },
    { code: 'IT 103', name: 'Data Structures', units: 3, prereq: 'IT 102', schedule: 'TTH 10:00-11:30 AM', room: '303', instructor: 'Prof. Tan', available: false },
    { code: 'MATH 102', name: 'Plane Trigonometry', units: 3, prereq: 'MATH 101', schedule: 'MWF 10:00-11:30 AM', room: '206', instructor: 'Prof. Lim', available: true },
    { code: 'ENG 102', name: 'Technical Writing', units: 3, prereq: 'ENG 101', schedule: 'TTH 1:00-2:30 PM', room: '103', instructor: 'Prof. Santos', available: true },
    { code: 'SCI 101', name: 'General Physics', units: 3, prereq: null, schedule: 'MWF 3:00-4:30 PM', room: '401', instructor: 'Prof. Cruz', available: true },
];

// Lessons data
const lessonsData = {
    'it101-1': { title: 'IT 101 - Lesson 1: Introduction to Computers', desc: 'Learn about the basic components of a computer system and how they work together.', videoId: 'dQw4w9WgXcQ' },
    'it101-2': { title: 'IT 101 - Lesson 2: Hardware Components', desc: 'Explore the different hardware components that make up a computer.', videoId: 'dQw4w9WgXcQ' },
    'math101-1': { title: 'MATH 101 - Lesson 1: Basic Algebraic Expressions', desc: 'Understanding variables, coefficients, and basic algebraic operations.', videoId: 'dQw4w9WgXcQ' },
    'eng101-1': { title: 'ENG 101 - Lesson 1: Effective Communication', desc: 'Master the fundamentals of effective written and verbal communication.', videoId: 'dQw4w9WgXcQ' },
};

// ==================== HTML TEMPLATES ====================
const templates = {
    dashboard: `
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-2xl p-6 card-shadow">
                <div class="flex items-center justify-between mb-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div><span class="text-xs text-gray-400">This Sem</span>
                </div>
                <p class="text-3xl font-bold text-gray-800" id="enrolled-subjects">6</p>
                <p class="text-sm text-gray-500">Enrolled Subjects</p>
            </div>
            <div class="bg-white rounded-2xl p-6 card-shadow">
                <div class="flex items-center justify-between mb-4">
                    <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div><span class="text-xs text-gray-400">Current</span>
                </div>
                <p class="text-3xl font-bold text-gray-800" id="current-units">21</p>
                <p class="text-sm text-gray-500">Total Units</p>
            </div>
            <div class="bg-white rounded-2xl p-6 card-shadow">
                <div class="flex items-center justify-between mb-4">
                    <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div><span class="text-xs text-gray-400">Balance</span>
                </div>
                <p class="text-3xl font-bold text-gray-800" id="balance-amount">₱15,500</p>
                <p class="text-sm text-gray-500">Remaining Balance</p>
            </div>
            <div class="bg-white rounded-2xl p-6 card-shadow">
                <div class="flex items-center justify-between mb-4">
                    <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                    </div><span class="text-xs text-gray-400">GPA</span>
                </div>
                <p class="text-3xl font-bold text-gray-800">1.75</p>
                <p class="text-sm text-gray-500">Current GPA</p>
            </div>
        </div>
        <!-- Quick Actions & Schedule -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-white rounded-2xl p-6 card-shadow">
                <h3 class="font-bold text-gray-800 mb-4">Today's Schedule</h3>
                <div class="space-y-3" id="today-schedule">
                    <div class="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                        <div class="text-center"><p class="text-xs text-gray-500">8:00 AM</p><p class="text-xs text-gray-500">9:30 AM</p></div>
                        <div class="w-1 h-12 bg-blue-500 rounded-full"></div>
                        <div class="flex-1"><p class="font-semibold text-gray-800">IT 101 - Introduction to Computing</p><p class="text-sm text-gray-500">Room 301 • Prof. Santos</p></div>
                    </div>
                    <div class="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                        <div class="text-center"><p class="text-xs text-gray-500">10:00 AM</p><p class="text-xs text-gray-500">11:30 AM</p></div>
                        <div class="w-1 h-12 bg-green-500 rounded-full"></div>
                        <div class="flex-1"><p class="font-semibold text-gray-800">MATH 101 - College Algebra</p><p class="text-sm text-gray-500">Room 205 • Prof. Garcia</p></div>
                    </div>
                    <div class="flex items-center gap-4 p-4 bg-amber-50 rounded-xl">
                        <div class="text-center"><p class="text-xs text-gray-500">1:00 PM</p><p class="text-xs text-gray-500">2:30 PM</p></div>
                        <div class="w-1 h-12 bg-amber-500 rounded-full"></div>
                        <div class="flex-1"><p class="font-semibold text-gray-800">ENG 101 - Communication Arts</p><p class="text-sm text-gray-500">Room 102 • Prof. Reyes</p></div>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-2xl p-6 card-shadow">
                <h3 class="font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div class="space-y-3">
                    <button onclick="navigateTo('enrollment')" class="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                        <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg></div><span class="font-medium text-gray-700">Enroll Subjects</span>
                    </button>
                    <button onclick="navigateTo('soa')" class="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
                        <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div><span class="font-medium text-gray-700">View SOA</span>
                    </button>
                    <button onclick="navigateTo('lessons')" class="w-full flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors">
                        <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><span class="font-medium text-gray-700">Watch Lessons</span>
                    </button>
                </div>
                <h3 class="font-bold text-gray-800 mt-6 mb-4">Announcements</h3>
                <div class="space-y-3">
                    <div class="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg"><p class="text-sm font-medium text-red-800">Midterm Exams</p><p class="text-xs text-red-600">Oct 15-20, 2024</p></div>
                    <div class="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg"><p class="text-sm font-medium text-blue-800">Payment Deadline</p><p class="text-xs text-blue-600">Oct 10, 2024</p></div>
                </div>
            </div>
        </div>
    `,
    profile: `
        <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-2xl card-shadow overflow-hidden">
                <div class="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
                    <div class="flex items-center gap-6">
                        <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold">JD</div>
                        <div><h3 class="text-2xl font-bold">Juan Dela Cruz</h3><p class="text-blue-100">Student ID: 2024-00001</p><p class="text-blue-100">Bachelor of Science in Information Technology</p></div>
                    </div>
                </div>
                <div class="p-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-4 flex items-center gap-2"><svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> Personal Information</h4>
                            <div class="space-y-3"><div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-500">Full Name</span> <span class="font-medium text-gray-800">Juan Dela Cruz</span></div><div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-500">Date of Birth</span> <span class="font-medium text-gray-800">January 15, 2002</span></div><div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-500">Gender</span> <span class="font-medium text-gray-800">Male</span></div><div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-500">Civil Status</span> <span class="font-medium text-gray-800">Single</span></div><div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-500">Nationality</span> <span class="font-medium text-gray-800">Filipino</span></div></div>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-800 mb-4 flex items-center gap-2"><svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> Contact Information</h4>
                            <div class="space-y-3"><div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-500">Email</span> <span class="font-medium text-gray-800">juan.delacruz@email.com</span></div><div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-500">Phone</span> <span class="font-medium text-gray-800">+63 912 345 6789</span></div><div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-500">Address</span> <span class="font-medium text-gray-800 text-right">123 Sample St., Quezon City</span></div></div>
                            <h4 class="font-semibold text-gray-800 mt-6 mb-4 flex items-center gap-2"><svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> Academic Information</h4>
                            <div class="space-y-3"><div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-500">Year Level</span> <span class="font-medium text-gray-800">2nd Year</span></div><div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-500">Section</span> <span class="font-medium text-gray-800">BSIT 2-A</span></div><div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-500">Student Type</span> <span class="font-medium text-gray-800">Regular (Block)</span></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    'edit-profile': `
        <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-2xl card-shadow p-8">
                <h3 class="text-xl font-bold text-gray-800 mb-6">Edit Profile</h3>
                <form id="edit-profile-form" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label class="block text-sm font-medium text-gray-700 mb-2">First Name</label> <input type="text" value="Juan" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label> <input type="text" value="Dela Cruz" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label> <input type="email" value="juan.delacruz@email.com" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"></div>
                        <div><label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label> <input type="tel" value="+63 912 345 6789" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"></div>
                        <div class="md:col-span-2"><label class="block text-sm font-medium text-gray-700 mb-2">Address</label> <textarea rows="3" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none">123 Sample St., Quezon City</textarea></div>
                    </div>
                    <div class="flex justify-end gap-4 pt-4">
                        <button type="button" onclick="navigateTo('profile')" class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">Cancel</button>
                        <button type="submit" class="px-6 py-3 btn-primary text-white rounded-xl font-medium transition-all">Update Profile</button>
                    </div>
                </form>
            </div>
        </div>
    `,
    schedules: `
        <div class="bg-white rounded-2xl card-shadow p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-6">My Schedule - Select a Time Slot</h3>
            <div class="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div class="flex items-center gap-2"><div class="w-4 h-4 bg-blue-600 rounded"></div><span class="text-sm text-gray-700">Your Enrolled Classes</span></div>
                <div class="flex items-center gap-2"><div class="w-4 h-4 bg-gray-500 rounded"></div><span class="text-sm text-gray-700">Available (click to schedule)</span></div>
                <div class="flex items-center gap-2"><div class="w-4 h-4 bg-blue-500 rounded"></div><span class="text-sm text-gray-700">Scheduled (after click)</span></div>
                <div class="flex items-center gap-2"><div class="w-4 h-4 bg-red-500 rounded"></div><span class="text-sm text-gray-700">Unavailable</span></div>
            </div>
            <div class="overflow-x-auto mb-6">
                <table class="w-full">
                    <thead><tr class="bg-gray-50"><th class="p-4 text-left text-sm font-semibold text-gray-600 w-24">Time</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Monday</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Tuesday</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Wednesday</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Thursday</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Friday</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Saturday</th></tr></thead>
                    <tbody id="schedule-body">
                        <tr class="border-b border-gray-100"><td class="p-4 text-sm text-gray-600 font-medium">8:00 AM</td><td class="p-2"><button class="w-full h-16 bg-blue-600 text-white rounded-lg font-semibold text-xs flex items-center justify-center cursor-not-allowed enrolled" disabled>IT 101<br>Room 301</button></td><td class="p-2"><button class="schedule-slot available w-full h-16 text-white rounded-lg font-semibold transition-all ring-offset-2 hover:ring-2 hover:ring-gray-400" onclick="selectSlot('Tuesday', '8:00 AM', this)"></button></td><td class="p-2"><button class="w-full h-16 bg-blue-600 text-white rounded-lg font-semibold text-xs flex items-center justify-center cursor-not-allowed enrolled" disabled>IT 101<br>Room 301</button></td><td class="p-2"><button class="schedule-slot available w-full h-16 text-white rounded-lg font-semibold transition-all ring-offset-2 hover:ring-2 hover:ring-gray-400" onclick="selectSlot('Thursday', '8:00 AM', this)"></button></td><td class="p-2"><button class="w-full h-16 bg-blue-600 text-white rounded-lg font-semibold text-xs flex items-center justify-center cursor-not-allowed enrolled" disabled>IT 101<br>Room 301</button></td><td class="p-2"><button class="schedule-slot unavailable w-full h-16 text-white rounded-lg font-semibold" disabled></button></td></tr>
                        <tr class="border-b border-gray-100"><td class="p-4 text-sm text-gray-600 font-medium">10:00 AM</td><td class="p-2"><button class="schedule-slot available w-full h-16 text-white rounded-lg font-semibold transition-all ring-offset-2 hover:ring-2 hover:ring-gray-400" onclick="selectSlot('Monday', '10:00 AM', this)"></button></td><td class="p-2"><button class="w-full h-16 bg-blue-600 text-white rounded-lg font-semibold text-xs flex items-center justify-center cursor-not-allowed enrolled" disabled>MATH 101<br>Room 205</button></td><td class="p-2"><button class="schedule-slot available w-full h-16 text-white rounded-lg font-semibold transition-all ring-offset-2 hover:ring-2 hover:ring-gray-400" onclick="selectSlot('Wednesday', '10:00 AM', this)"></button></td><td class="p-2"><button class="w-full h-16 bg-blue-600 text-white rounded-lg font-semibold text-xs flex items-center justify-center cursor-not-allowed enrolled" disabled>MATH 101<br>Room 205</button></td><td class="p-2"><button class="schedule-slot available w-full h-16 text-white rounded-lg font-semibold transition-all ring-offset-2 hover:ring-2 hover:ring-gray-400" onclick="selectSlot('Friday', '10:00 AM', this)"></button></td><td class="p-2"><button class="schedule-slot unavailable w-full h-16 text-white rounded-lg font-semibold" disabled></button></td></tr>
                        <tr class="border-b border-gray-100"><td class="p-4 text-sm text-gray-600 font-medium">1:00 PM</td><td class="p-2"><button class="w-full h-16 bg-blue-600 text-white rounded-lg font-semibold text-xs flex items-center justify-center cursor-not-allowed enrolled" disabled>ENG 101<br>Room 102</button></td><td class="p-2"><button class="w-full h-16 bg-blue-600 text-white rounded-lg font-semibold text-xs flex items-center justify-center cursor-not-allowed enrolled" disabled>PE 101<br>Gym</button></td><td class="p-2"><button class="w-full h-16 bg-blue-600 text-white rounded-lg font-semibold text-xs flex items-center justify-center cursor-not-allowed enrolled" disabled>ENG 101<br>Room 102</button></td><td class="p-2"><button class="w-full h-16 bg-blue-600 text-white rounded-lg font-semibold text-xs flex items-center justify-center cursor-not-allowed enrolled" disabled>PE 101<br>Gym</button></td><td class="p-2"><button class="w-full h-16 bg-blue-600 text-white rounded-lg font-semibold text-xs flex items-center justify-center cursor-not-allowed enrolled" disabled>ENG 101<br>Room 102</button></td><td class="p-2"><button class="schedule-slot available w-full h-16 text-white rounded-lg font-semibold transition-all ring-offset-2 hover:ring-2 hover:ring-gray-400" onclick="selectSlot('Saturday', '1:00 PM', this)"></button></td></tr>
                        <tr class="border-b border-gray-100"><td class="p-4 text-sm text-gray-600 font-medium">3:00 PM</td><td class="p-2"><button class="w-full h-16 bg-blue-600 text-white rounded-lg font-semibold text-xs flex items-center justify-center cursor-not-allowed enrolled" disabled>FIL 101<br>Room 108</button></td><td class="p-2"><button class="schedule-slot available w-full h-16 text-white rounded-lg font-semibold transition-all ring-offset-2 hover:ring-2 hover:ring-gray-400" onclick="selectSlot('Tuesday', '3:00 PM', this)"></button></td><td class="p-2"><button class="w-full h-16 bg-blue-600 text-white rounded-lg font-semibold text-xs flex items-center justify-center cursor-not-allowed enrolled" disabled>FIL 101<br>Room 108</button></td><td class="p-2"><button class="schedule-slot available w-full h-16 text-white rounded-lg font-semibold transition-all ring-offset-2 hover:ring-2 hover:ring-gray-400" onclick="selectSlot('Thursday', '3:00 PM', this)"></button></td><td class="p-2"><button class="w-full h-16 bg-blue-600 text-white rounded-lg font-semibold text-xs flex items-center justify-center cursor-not-allowed enrolled" disabled>NSTP 1<br>AVR</button></td><td class="p-2"><button class="schedule-slot unavailable w-full h-16 text-white rounded-lg font-semibold" disabled></button></td></tr>
                    </tbody>
                </table>
            </div>
            <div class="p-4 bg-blue-50 rounded-xl border border-blue-200"><p class="text-sm text-blue-600"><span class="font-semibold">Selected Time:</span> <span id="selected-time">Click on a grey slot to schedule (turns blue)</span></p></div>
        </div>
    `,
    enrollment: `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2">
                <div class="bg-white rounded-2xl card-shadow p-6 mb-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold text-gray-800">Enrollment</h3>
                        <div id="student-type-toggle" class="flex bg-gray-100 rounded-lg p-1">
                            <button onclick="setStudentType('block')" id="btn-block" class="px-4 py-2 rounded-md text-sm font-medium transition-all bg-blue-600 text-white">Block</button>
                            <button onclick="setStudentType('non-block')" id="btn-non-block" class="px-4 py-2 rounded-md text-sm font-medium transition-all text-gray-600">Non-Block</button>
                        </div>
                    </div>
                    <div id="block-notice" class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"><div class="flex items-start gap-3"><svg class="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><div><p class="font-semibold text-blue-800">Block Schedule Active</p><p class="text-sm text-blue-600">Your subjects are pre-assigned based on your section. You cannot modify your schedule.</p></div></div></div>
                    <div id="non-block-notice" class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 hidden"><div class="flex items-start gap-3"><svg class="w-6 h-6 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg><div><p class="font-semibold text-amber-800">Non-Block Schedule</p><p class="text-sm text-amber-600">You can choose your subjects. System will check prerequisites, teacher availability, and schedule conflicts.</p></div></div></div>
                    <div id="available-subjects" class="hidden"><h4 class="font-semibold text-gray-800 mb-4">Available Subjects</h4><div class="space-y-3" id="subjects-list"></div></div>
                    <h4 class="font-semibold text-gray-800 mb-4">Enrolled Subjects</h4>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50"><tr><th class="p-3 text-left text-sm font-semibold text-gray-600">Code</th><th class="p-3 text-left text-sm font-semibold text-gray-600">Subject</th><th class="p-3 text-center text-sm font-semibold text-gray-600">Units</th><th class="p-3 text-left text-sm font-semibold text-gray-600">Schedule</th><th class="p-3 text-left text-sm font-semibold text-gray-600">Instructor</th><th class="p-3 text-center text-sm font-semibold text-gray-600" id="action-header">Action</th></tr></thead>
                            <tbody id="enrolled-subjects-list"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div><div class="bg-white rounded-2xl card-shadow p-6 sticky top-24"><h3 class="font-bold text-gray-800 mb-4">Enrollment Summary</h3><div class="space-y-4"><div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-500">Total Subjects</span> <span class="font-semibold text-gray-800">6</span></div><div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-500">Total Units</span> <span class="font-semibold text-gray-800">21</span></div><div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-500">Tuition Fee</span> <span class="font-semibold text-gray-800">₱25,000</span></div><div class="flex justify-between py-2 border-b border-gray-100"><span class="text-gray-500">Misc. Fees</span> <span class="font-semibold text-gray-800">₱5,500</span></div><div class="flex justify-between py-3 bg-blue-50 rounded-lg px-3 -mx-3"><span class="font-semibold text-blue-800">Total Amount</span> <span class="font-bold text-blue-800">₱30,500</span></div></div><div class="mt-6 p-4 bg-amber-50 rounded-xl"><p class="text-sm text-amber-800 font-medium">⚠️ Balance Due</p><p class="text-2xl font-bold text-amber-900">₱15,500</p><p class="text-xs text-amber-600 mt-1">Due: October 10, 2024</p></div></div></div>
        </div>
    `,
    grades: `
        <div class="bg-white rounded-2xl card-shadow overflow-hidden">
            <div id="grades-locked" class="relative">
                <div class="absolute inset-0 locked-overlay z-10 flex items-center justify-center rounded-2xl"><div class="text-center text-white p-8"><svg class="w-16 h-16 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg><h3 class="text-2xl font-bold mb-2">Grades Locked</h3><p class="text-gray-300 mb-4">Please settle your balance to view your grades.</p><button onclick="navigateTo('soa')" class="px-6 py-3 bg-white text-gray-800 rounded-xl font-semibold hover:bg-gray-100 transition-colors">View Statement of Account</button></div></div>
                <div class="p-6 filter blur-sm"><h3 class="text-xl font-bold text-gray-800 mb-6">Academic Grades - 1st Semester 2024-2025</h3><table class="w-full"><thead class="bg-gray-50"><tr><th class="p-4 text-left text-sm font-semibold text-gray-600">Subject Code</th><th class="p-4 text-left text-sm font-semibold text-gray-600">Description</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Units</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Prelim</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Midterm</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Final</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Grade</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Remarks</th></tr></thead><tbody><tr class="border-b border-gray-100"><td class="p-4 text-sm font-medium text-gray-800">IT 101</td><td class="p-4 text-sm text-gray-600">Introduction to Computing</td><td class="p-4 text-sm text-gray-600 text-center">3</td><td class="p-4 text-sm text-gray-600 text-center">1.50</td><td class="p-4 text-sm text-gray-600 text-center">1.75</td><td class="p-4 text-sm text-gray-600 text-center">-</td><td class="p-4 text-sm font-semibold text-gray-800 text-center">-</td><td class="p-4 text-center"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Ongoing</span></td></tr><tr class="border-b border-gray-100"><td class="p-4 text-sm font-medium text-gray-800">MATH 101</td><td class="p-4 text-sm text-gray-600">College Algebra</td><td class="p-4 text-sm text-gray-600 text-center">3</td><td class="p-4 text-sm text-gray-600 text-center">2.00</td><td class="p-4 text-sm text-gray-600 text-center">1.75</td><td class="p-4 text-sm text-gray-600 text-center">-</td><td class="p-4 text-sm font-semibold text-gray-800 text-center">-</td><td class="p-4 text-center"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Ongoing</span></td></tr></tbody></table></div>
            </div>
            <div id="grades-unlocked" class="p-6 hidden"><h3 class="text-xl font-bold text-gray-800 mb-6">Academic Grades - 1st Semester 2024-2025</h3><div class="overflow-x-auto"><table class="w-full"><thead class="bg-gray-50"><tr><th class="p-4 text-left text-sm font-semibold text-gray-600">Subject Code</th><th class="p-4 text-left text-sm font-semibold text-gray-600">Description</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Units</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Prelim</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Midterm</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Final</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Grade</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Remarks</th></tr></thead><tbody><tr class="border-b border-gray-100"><td class="p-4 text-sm font-medium text-gray-800">IT 101</td><td class="p-4 text-sm text-gray-600">Introduction to Computing</td><td class="p-4 text-sm text-gray-600 text-center">3</td><td class="p-4 text-sm text-gray-600 text-center">1.50</td><td class="p-4 text-sm text-gray-600 text-center">1.75</td><td class="p-4 text-sm text-gray-600 text-center">-</td><td class="p-4 text-sm font-semibold text-gray-800 text-center">-</td><td class="p-4 text-center"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Ongoing</span></td></tr><tr class="border-b border-gray-100"><td class="p-4 text-sm font-medium text-gray-800">MATH 101</td><td class="p-4 text-sm text-gray-600">College Algebra</td><td class="p-4 text-sm text-gray-600 text-center">3</td><td class="p-4 text-sm text-gray-600 text-center">2.00</td><td class="p-4 text-sm text-gray-600 text-center">1.75</td><td class="p-4 text-sm text-gray-600 text-center">-</td><td class="p-4 text-sm font-semibold text-gray-800 text-center">-</td><td class="p-4 text-center"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Ongoing</span></td></tr><tr class="border-b border-gray-100"><td class="p-4 text-sm font-medium text-gray-800">ENG 101</td><td class="p-4 text-sm text-gray-600">Communication Arts</td><td class="p-4 text-sm text-gray-600 text-center">3</td><td class="p-4 text-sm text-gray-600 text-center">1.25</td><td class="p-4 text-sm text-gray-600 text-center">1.50</td><td class="p-4 text-sm text-gray-600 text-center">-</td><td class="p-4 text-sm font-semibold text-gray-800 text-center">-</td><td class="p-4 text-center"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Ongoing</span></td></tr><tr class="border-b border-gray-100"><td class="p-4 text-sm font-medium text-gray-800">PE 101</td><td class="p-4 text-sm text-gray-600">Physical Education 1</td><td class="p-4 text-sm text-gray-600 text-center">2</td><td class="p-4 text-sm text-gray-600 text-center">1.00</td><td class="p-4 text-sm text-gray-600 text-center">1.00</td><td class="p-4 text-sm text-gray-600 text-center">-</td><td class="p-4 text-sm font-semibold text-gray-800 text-center">-</td><td class="p-4 text-center"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Ongoing</span></td></tr><tr class="border-b border-gray-100"><td class="p-4 text-sm font-medium text-gray-800">FIL 101</td><td class="p-4 text-sm text-gray-600">Komunikasyon sa Filipino</td><td class="p-4 text-sm text-gray-600 text-center">3</td><td class="p-4 text-sm text-gray-600 text-center">1.75</td><td class="p-4 text-sm text-gray-600 text-center">2.00</td><td class="p-4 text-sm text-gray-600 text-center">-</td><td class="p-4 text-sm font-semibold text-gray-800 text-center">-</td><td class="p-4 text-center"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Ongoing</span></td></tr><tr class="border-b border-gray-100"><td class="p-4 text-sm font-medium text-gray-800">NSTP 1</td><td class="p-4 text-sm text-gray-600">National Service Training</td><td class="p-4 text-sm text-gray-600 text-center">3</td><td class="p-4 text-sm text-gray-600 text-center">1.50</td><td class="p-4 text-sm text-gray-600 text-center">1.50</td><td class="p-4 text-sm text-gray-600 text-center">-</td><td class="p-4 text-sm font-semibold text-gray-800 text-center">-</td><td class="p-4 text-center"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Ongoing</span></td></tr></tbody></table></div></div>
        </div>
    `,
    lessons: `
        <div id="lessons-locked" class="bg-white rounded-2xl card-shadow p-8 text-center"><svg class="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg><h3 class="text-2xl font-bold text-gray-800 mb-2">Video Lessons Locked</h3><p class="text-gray-500 mb-6">Please settle your account balance to access video lessons.</p><button onclick="navigateTo('soa')" class="px-6 py-3 btn-primary text-white rounded-xl font-semibold transition-all">View Statement of Account</button></div>
        <div id="lessons-unlocked" class="hidden"><div class="grid grid-cols-1 lg:grid-cols-3 gap-6"><div class="lg:col-span-2"><div class="bg-white rounded-2xl card-shadow overflow-hidden"><div id="video-player" class="aspect-video bg-gray-900 flex items-center justify-center"><div class="text-center text-gray-400"><svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><p>Select a lesson to start watching</p></div></div><div class="p-6"><h3 id="current-video-title" class="text-xl font-bold text-gray-800">Select a Lesson</h3><p id="current-video-desc" class="text-gray-500 mt-2">Choose a lesson from the sidebar to begin learning.</p></div></div></div><div class="bg-white rounded-2xl card-shadow p-6"><h3 class="font-bold text-gray-800 mb-4">Available Lessons</h3><div class="space-y-3" id="lessons-list"><div onclick="playLesson('it101-1')" class="lesson-item p-4 bg-blue-50 hover:bg-blue-100 rounded-xl cursor-pointer transition-colors"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div><div><p class="font-medium text-gray-800 text-sm">IT 101 - Lesson 1</p><p class="text-xs text-gray-500">Introduction to Computers</p></div></div></div><div onclick="playLesson('it101-2')" class="lesson-item p-4 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center text-white"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div><div><p class="font-medium text-gray-800 text-sm">IT 101 - Lesson 2</p><p class="text-xs text-gray-500">Hardware Components</p></div></div></div><div onclick="playLesson('math101-1')" class="lesson-item p-4 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center text-white"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div><div><p class="font-medium text-gray-800 text-sm">MATH 101 - Lesson 1</p><p class="text-xs text-gray-500">Basic Algebraic Expressions</p></div></div></div><div onclick="playLesson('eng101-1')" class="lesson-item p-4 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center text-white"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div><div><p class="font-medium text-gray-800 text-sm">ENG 101 - Lesson 1</p><p class="text-xs text-gray-500">Effective Communication</p></div></div></div></div></div></div></div>
    `,
    soa: `
        <div class="max-w-4xl mx-auto"><div class="bg-white rounded-2xl card-shadow p-8"><div class="flex items-center justify-between mb-8"><div><h3 class="text-xl font-bold text-gray-800">Statement of Account</h3><p class="text-gray-500">1st Semester, Academic Year 2024-2025</p></div><button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>Print SOA</button></div><div class="grid grid-cols-2 gap-6 mb-8 p-6 bg-gray-50 rounded-xl"><div><p class="text-sm text-gray-500">Student Name</p><p class="font-semibold text-gray-800">Juan Dela Cruz</p></div><div><p class="text-sm text-gray-500">Student ID</p><p class="font-semibold text-gray-800">2024-00001</p></div><div><p class="text-sm text-gray-500">Program</p><p class="font-semibold text-gray-800">BS Information Technology</p></div><div><p class="text-sm text-gray-500">Year & Section</p><p class="font-semibold text-gray-800">2nd Year - BSIT 2-A</p></div></div><h4 class="font-semibold text-gray-800 mb-4">Assessment of Fees</h4><div class="overflow-x-auto mb-6"><table class="w-full"><thead class="bg-gray-50"><tr><th class="p-3 text-left text-sm font-semibold text-gray-600">Description</th><th class="p-3 text-right text-sm font-semibold text-gray-600">Amount</th></tr></thead><tbody><tr class="border-b border-gray-100"><td class="p-3 text-sm text-gray-600">Tuition Fee (21 units x ₱1,190.48)</td><td class="p-3 text-sm text-gray-800 text-right">₱25,000.00</td></tr><tr class="border-b border-gray-100"><td class="p-3 text-sm text-gray-600">Laboratory Fee</td><td class="p-3 text-sm text-gray-800 text-right">₱2,000.00</td></tr><tr class="border-b border-gray-100"><td class="p-3 text-sm text-gray-600">Library Fee</td><td class="p-3 text-sm text-gray-800 text-right">₱500.00</td></tr><tr class="border-b border-gray-100"><td class="p-3 text-sm text-gray-600">Student ID</td><td class="p-3 text-sm text-gray-800 text-right">₱200.00</td></tr><tr class="border-b border-gray-100"><td class="p-3 text-sm text-gray-600">Athletic Fee</td><td class="p-3 text-sm text-gray-800 text-right">₱300.00</td></tr><tr class="border-b border-gray-100"><td class="p-3 text-sm text-gray-600">Medical/Dental Fee</td><td class="p-3 text-sm text-gray-800 text-right">₱500.00</td></tr><tr class="border-b border-gray-100"><td class="p-3 text-sm text-gray-600">Student Organization Fee</td><td class="p-3 text-sm text-gray-800 text-right">₱500.00</td></tr><tr class="border-b border-gray-100"><td class="p-3 text-sm text-gray-600">Guidance Fee</td><td class="p-3 text-sm text-gray-800 text-right">₱300.00</td></tr><tr class="border-b border-gray-100"><td class="p-3 text-sm text-gray-600">Insurance</td><td class="p-3 text-sm text-gray-800 text-right">₱200.00</td></tr><tr class="border-b border-gray-100"><td class="p-3 text-sm text-gray-600">Development Fee</td><td class="p-3 text-sm text-gray-800 text-right">₱1,000.00</td></tr><tr class="bg-blue-50"><td class="p-3 text-sm font-semibold text-blue-800">Total Assessment</td><td class="p-3 text-sm font-bold text-blue-800 text-right">₱30,500.00</td></tr></tbody></table></div><h4 class="font-semibold text-gray-800 mb-4">Payment History</h4><div class="overflow-x-auto mb-6"><table class="w-full"><thead class="bg-gray-50"><tr><th class="p-3 text-left text-sm font-semibold text-gray-600">Date</th><th class="p-3 text-left text-sm font-semibold text-gray-600">OR Number</th><th class="p-3 text-left text-sm font-semibold text-gray-600">Description</th><th class="p-3 text-right text-sm font-semibold text-gray-600">Amount</th></tr></thead><tbody><tr class="border-b border-gray-100"><td class="p-3 text-sm text-gray-600">Aug 15, 2024</td><td class="p-3 text-sm text-gray-800">OR-2024-00123</td><td class="p-3 text-sm text-gray-600">Down Payment</td><td class="p-3 text-sm text-green-600 text-right">₱15,000.00</td></tr><tr class="bg-green-50"><td colspan="3" class="p-3 text-sm font-semibold text-green-800">Total Payments</td><td class="p-3 text-sm font-bold text-green-800 text-right">₱15,000.00</td></tr></tbody></table></div><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div class="p-4 bg-blue-50 rounded-xl"><p class="text-sm text-blue-600">Total Assessment</p><p class="text-2xl font-bold text-blue-800">₱30,500.00</p></div><div class="p-4 bg-green-50 rounded-xl"><p class="text-sm text-green-600">Total Payments</p><p class="text-2xl font-bold text-green-800">₱15,000.00</p></div><div class="p-4 bg-red-50 rounded-xl"><p class="text-sm text-red-600">Balance Due</p><p class="text-2xl font-bold text-red-800">₱15,500.00</p></div></div><div class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl"><div class="flex items-start gap-3"><svg class="w-6 h-6 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg><div><p class="font-semibold text-amber-800">Payment Reminder</p><p class="text-sm text-amber-600">Please settle your remaining balance of ₱15,500.00 before October 10, 2024 to avoid penalties and to access grades and exam permits.</p></div></div></div><div class="mt-6 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"><p class="text-sm text-gray-500 mb-3">🎮 Demo Mode: Simulate payment status</p><div class="flex gap-3"><button onclick="simulatePayment(true)" class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">✓ Mark as Paid</button><button onclick="simulatePayment(false)" class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">✗ Mark as Unpaid</button></div></div></div></div>
    `,
    payments: `
        <div class="bg-white rounded-2xl card-shadow p-6"><h3 class="text-xl font-bold text-gray-800 mb-6">Payment History</h3><div class="overflow-x-auto"><table class="w-full"><thead class="bg-gray-50"><tr><th class="p-4 text-left text-sm font-semibold text-gray-600">Date</th><th class="p-4 text-left text-sm font-semibold text-gray-600">OR Number</th><th class="p-4 text-left text-sm font-semibold text-gray-600">Description</th><th class="p-4 text-left text-sm font-semibold text-gray-600">Semester</th><th class="p-4 text-right text-sm font-semibold text-gray-600">Amount</th><th class="p-4 text-center text-sm font-semibold text-gray-600">Status</th></tr></thead><tbody><tr class="border-b border-gray-100"><td class="p-4 text-sm text-gray-600">Aug 15, 2024</td><td class="p-4 text-sm font-medium text-gray-800">OR-2024-00123</td><td class="p-4 text-sm text-gray-600">Down Payment</td><td class="p-4 text-sm text-gray-600">1st Sem 2024-2025</td><td class="p-4 text-sm text-gray-800 text-right">₱15,000.00</td><td class="p-4 text-center"><span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Verified</span></td></tr><tr class="border-b border-gray-100"><td class="p-4 text-sm text-gray-600">Jan 10, 2024</td><td class="p-4 text-sm font-medium text-gray-800">OR-2024-00089</td><td class="p-4 text-sm text-gray-600">Full Payment</td><td class="p-4 text-sm text-gray-600">2nd Sem 2023-2024</td><td class="p-4 text-sm text-gray-800 text-right">₱28,500.00</td><td class="p-4 text-center"><span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Verified</span></td></tr><tr class="border-b border-gray-100"><td class="p-4 text-sm text-gray-600">Aug 20, 2023</td><td class="p-4 text-sm font-medium text-gray-800">OR-2023-00456</td><td class="p-4 text-sm text-gray-600">Full Payment</td><td class="p-4 text-sm text-gray-600">1st Sem 2023-2024</td><td class="p-4 text-sm text-gray-800 text-right">₱28,500.00</td><td class="p-4 text-center"><span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Verified</span></td></tr></tbody></table></div></div>
    `,
    'exam-permit': `
        <div class="max-w-2xl mx-auto"><div id="no-permit" class="bg-white rounded-2xl card-shadow p-8 text-center"><svg class="w-20 h-20 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><h3 class="text-2xl font-bold text-gray-800 mb-2">No Exam Permit</h3><p class="text-gray-500 mb-6">You are not eligible to take exams. Please settle your account balance first.</p><div class="p-4 bg-red-50 rounded-xl mb-6"><p class="text-sm text-red-600">Outstanding Balance: <span class="font-bold">₱15,500.00</span></p><p class="text-xs text-red-500 mt-1">Pay at least 80% of your total assessment to get an exam permit.</p></div><button onclick="navigateTo('soa')" class="px-6 py-3 btn-primary text-white rounded-xl font-semibold transition-all">View Statement of Account</button></div><div id="has-permit" class="hidden"><div class="bg-white rounded-2xl card-shadow overflow-hidden"><div class="bg-gradient-to-r from-green-600 to-green-800 p-6 text-white text-center"><svg class="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg><h3 class="text-2xl font-bold">EXAM PERMIT</h3><p class="text-green-100">Valid for Midterm Examinations</p></div><div class="p-6"><div class="grid grid-cols-2 gap-4 mb-6"><div><p class="text-sm text-gray-500">Student Name</p><p class="font-semibold text-gray-800">Juan Dela Cruz</p></div><div><p class="text-sm text-gray-500">Student ID</p><p class="font-semibold text-gray-800">2024-00001</p></div><div><p class="text-sm text-gray-500">Program & Year</p><p class="font-semibold text-gray-800">BSIT - 2nd Year</p></div><div><p class="text-sm text-gray-500">Exam Period</p><p class="font-semibold text-gray-800">Midterm 2024</p></div></div><h4 class="font-semibold text-gray-800 mb-3">Subjects Covered</h4><div class="space-y-2"><div class="flex items-center justify-between p-3 bg-green-50 rounded-lg"><span class="text-sm text-gray-700">IT 101 - Introduction to Computing</span> <span class="text-xs text-green-600 font-medium">✓ Cleared</span></div><div class="flex items-center justify-between p-3 bg-green-50 rounded-lg"><span class="text-sm text-gray-700">MATH 101 - College Algebra</span> <span class="text-xs text-green-600 font-medium">✓ Cleared</span></div><div class="flex items-center justify-between p-3 bg-green-50 rounded-lg"><span class="text-sm text-gray-700">ENG 101 - Communication Arts</span> <span class="text-xs text-green-600 font-medium">✓ Cleared</span></div><div class="flex items-center justify-between p-3 bg-green-50 rounded-lg"><span class="text-sm text-gray-700">PE 101 - Physical Education 1</span> <span class="text-xs text-green-600 font-medium">✓ Cleared</span></div><div class="flex items-center justify-between p-3 bg-green-50 rounded-lg"><span class="text-sm text-gray-700">FIL 101 - Komunikasyon sa Filipino</span> <span class="text-xs text-green-600 font-medium">✓ Cleared</span></div><div class="flex items-center justify-between p-3 bg-green-50 rounded-lg"><span class="text-sm text-gray-700">NSTP 1 - National Service Training</span> <span class="text-xs text-green-600 font-medium">✓ Cleared</span></div></div><button class="w-full mt-6 px-6 py-3 btn-primary text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>Print Exam Permit</button></div></div></div></div>
    `
};

// ==================== UTILITY FUNCTIONS ====================

// Inject template into view container
function renderView(viewName) {
    const container = document.getElementById(`view-${viewName}`);
    if (container && templates[viewName]) {
        container.innerHTML = templates[viewName];
    }
}

// Navigation
function navigateTo(view) {
    document.querySelectorAll('[id^="view-"]').forEach(el => el.classList.add('hidden'));
    const targetView = document.getElementById(`view-${view}`);
    if (targetView) {
        targetView.classList.remove('hidden');
        // If view content is not yet rendered, render it
        if (targetView.children.length === 0) {
            renderView(view);
        }
    }

    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navItem = document.querySelector(`[data-nav="${view}"]`);
    if (navItem) navItem.classList.add('active');

    const titles = {
        'dashboard': 'Dashboard',
        'profile': 'View Profile',
        'edit-profile': 'Edit Profile',
        'schedules': 'My Schedules',
        'enrollment': 'Enrollment',
        'grades': 'View Grades',
        'lessons': 'Video Lessons',
        'soa': 'Statement of Account',
        'payments': 'Payment History',
        'exam-permit': 'Exam Permit'
    };
    document.getElementById('page-title').textContent = titles[view] || 'Dashboard';
    currentView = view;

    // Special re-renders or updates after navigation
    if (view === 'enrollment') {
        // Re-apply student type UI after template render
        setTimeout(() => {
            setStudentType(studentType);
            renderEnrolledSubjects(studentType === 'block');
        }, 50);
    } else if (view === 'schedules') {
        // Reset selected slot display
        document.getElementById('selected-time').textContent = 'Click on a grey slot to schedule (turns blue)';
        if (selectedSlot) {
            selectedSlot.classList.remove('ring-2', 'ring-blue-400');
            selectedSlot = null;
        }
    } else if (view === 'grades' || view === 'lessons' || view === 'exam-permit') {
        updatePaymentStatus(); // Reapply locked/unlocked state
    }
}

// Select Schedule Slot: turns grey slot to blue (scheduled)
function selectSlot(day, time, element) {
    if (selectedSlot) {
        selectedSlot.classList.remove('ring-2', 'ring-blue-400');
    }

    element.classList.remove('available');
    element.classList.add('scheduled');

    selectedSlot = element;
    selectedSlot.classList.add('ring-2', 'ring-blue-400');

    document.getElementById('selected-time').textContent = `${day} at ${time} - Scheduled ✓`;
    showToast(`Scheduled: ${day} at ${time}`, 'success');
}

// Student Type Toggle
function setStudentType(type) {
    studentType = type;
    const btnBlock = document.getElementById('btn-block');
    const btnNonBlock = document.getElementById('btn-non-block');
    const blockNotice = document.getElementById('block-notice');
    const nonBlockNotice = document.getElementById('non-block-notice');
    const availableSubjectsDiv = document.getElementById('available-subjects');
    const actionHeader = document.getElementById('action-header');

    if (!btnBlock || !btnNonBlock) return; // elements not rendered yet

    if (type === 'block') {
        btnBlock.className = 'px-4 py-2 rounded-md text-sm font-medium transition-all bg-blue-600 text-white';
        btnNonBlock.className = 'px-4 py-2 rounded-md text-sm font-medium transition-all text-gray-600';
        blockNotice.classList.remove('hidden');
        nonBlockNotice.classList.add('hidden');
        availableSubjectsDiv.classList.add('hidden');
        actionHeader.textContent = 'Status';
        renderEnrolledSubjects(true);
    } else {
        btnBlock.className = 'px-4 py-2 rounded-md text-sm font-medium transition-all text-gray-600';
        btnNonBlock.className = 'px-4 py-2 rounded-md text-sm font-medium transition-all bg-blue-600 text-white';
        blockNotice.classList.add('hidden');
        nonBlockNotice.classList.remove('hidden');
        availableSubjectsDiv.classList.remove('hidden');
        actionHeader.textContent = 'Action';
        renderAvailableSubjects();
        renderEnrolledSubjects(false);
    }
}

// Render Available Subjects
function renderAvailableSubjects() {
    const container = document.getElementById('subjects-list');
    if (!container) return;

    container.innerHTML = availableSubjects.map(subject => {
        const hasPrereq = !subject.prereq || checkPrerequisite(subject.prereq);
        const canEnroll = subject.available && hasPrereq;

        return `
            <div class="schedule-card p-4 border border-gray-200 rounded-xl ${!canEnroll ? 'opacity-60' : ''}">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="font-semibold text-gray-800">${subject.code}</span>
                            <span class="text-xs px-2 py-0.5 rounded-full font-medium ${subject.available ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}">
                                ${subject.available ? '✓ Teacher Available' : '✗ No Available Teacher'}
                            </span>
                        </div>
                        <p class="text-sm text-gray-600">${subject.name}</p>
                        <p class="text-xs text-gray-400 mt-1">${subject.schedule} • ${subject.room} • ${subject.instructor}</p>
                        ${subject.prereq ? `<p class="text-xs mt-1 ${hasPrereq ? 'text-green-600' : 'text-red-600'}">Prerequisite: ${subject.prereq} ${hasPrereq ? '✓' : '(Not Met)'}</p>` : ''}
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-gray-600">${subject.units} units</span>
                        <button onclick="enrollSubject('${subject.code}')" 
                            class="px-4 py-2 rounded-lg text-sm font-medium transition-all ${canEnroll ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}"
                            ${!canEnroll ? 'disabled' : ''}>
                            ${canEnroll ? 'Enroll' : 'Unavailable'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Check Prerequisites (simulated)
function checkPrerequisite(prereqCode) {
    const passedSubjects = ['IT 101', 'MATH 101', 'ENG 101'];
    return passedSubjects.includes(prereqCode);
}

// Enroll Subject
async function enrollSubject(code) {
    const subject = availableSubjects.find(s => s.code === code);
    if (!subject) return;

    const hasConflict = false; // Would check actual schedule conflicts

    if (hasConflict) {
        showToast('Schedule conflict detected!', 'error');
        return;
    }

    if (window.dataSdk) {
        const result = await window.dataSdk.create({
            student_id: '2024-00001',
            type: 'enrollment',
            subject_code: code,
            schedule_id: subject.schedule,
            enrolled_at: new Date().toISOString()
        });

        if (result.isOk) {
            showToast(`Successfully enrolled in ${code}!`, 'success');
            renderAvailableSubjects();
        } else {
            showToast('Enrollment failed. Please try again.', 'error');
        }
    } else {
        showToast(`Demo: Enrolled in ${code}!`, 'success');
    }
}

// Render Enrolled Subjects
function renderEnrolledSubjects(isBlock) {
    const tbody = document.getElementById('enrolled-subjects-list');
    if (!tbody) return;

    const subjects = [
        { code: 'IT 101', name: 'Introduction to Computing', units: 3, schedule: 'MWF 8:00-9:30 AM', instructor: 'Prof. Santos' },
        { code: 'MATH 101', name: 'College Algebra', units: 3, schedule: 'TTH 10:00-11:30 AM', instructor: 'Prof. Garcia' },
        { code: 'ENG 101', name: 'Communication Arts', units: 3, schedule: 'MWF 1:00-2:30 PM', instructor: 'Prof. Reyes' },
        { code: 'PE 101', name: 'Physical Education 1', units: 2, schedule: 'TTH 1:00-2:30 PM', instructor: 'Prof. Cruz' },
        { code: 'FIL 101', name: 'Komunikasyon sa Filipino', units: 3, schedule: 'MW 3:00-4:30 PM', instructor: 'Prof. Aquino' },
        { code: 'NSTP 1', name: 'National Service Training', units: 3, schedule: 'F 3:00-6:00 PM', instructor: 'Prof. Mendoza' },
    ];

    tbody.innerHTML = subjects.map(s => `
        <tr class="border-b border-gray-100">
            <td class="p-3 text-sm font-medium text-gray-800">${s.code}</td>
            <td class="p-3 text-sm text-gray-600">${s.name}</td>
            <td class="p-3 text-sm text-gray-600 text-center">${s.units}</td>
            <td class="p-3 text-sm text-gray-600">${s.schedule}</td>
            <td class="p-3 text-sm text-gray-600">${s.instructor}</td>
            <td class="p-3 text-center">
                ${isBlock 
                    ? '<span class="text-xs text-gray-400">Locked</span>' 
                    : '<button class="text-xs text-red-600 hover:text-red-800" onclick="showToast(\'Drop feature demo\', \'info\')">Drop</button>'}
            </td>
        </tr>
    `).join('');
}

// Play Lesson
function playLesson(lessonId) {
    if (!isPaid) {
        showToast('Please settle your balance to access lessons.', 'error');
        return;
    }

    const lesson = lessonsData[lessonId];
    if (!lesson) return;

    document.getElementById('video-player').innerHTML = `
        <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/${lesson.videoId}?autoplay=1" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    `;
    document.getElementById('current-video-title').textContent = lesson.title;
    document.getElementById('current-video-desc').textContent = lesson.desc;

    // Update active lesson
    document.querySelectorAll('.lesson-item').forEach(el => {
        el.classList.remove('bg-blue-50');
        el.classList.add('bg-gray-50');
        const iconContainer = el.querySelector('div > div');
        if (iconContainer) {
            iconContainer.classList.remove('bg-blue-500');
            iconContainer.classList.add('bg-gray-400');
        }
    });

    if (event && event.currentTarget) {
        event.currentTarget.classList.remove('bg-gray-50');
        event.currentTarget.classList.add('bg-blue-50');
        const iconContainer = event.currentTarget.querySelector('div > div');
        if (iconContainer) {
            iconContainer.classList.remove('bg-gray-400');
            iconContainer.classList.add('bg-blue-500');
        }
    }
}

// Simulate Payment
function simulatePayment(paid) {
    isPaid = paid;
    hasExamPermit = paid;
    updatePaymentStatus();
    showToast(paid ? 'Payment status updated to PAID!' : 'Payment status updated to UNPAID!', paid ? 'success' : 'info');
}

// Update Payment Status
function updatePaymentStatus() {
    const paymentBadge = document.getElementById('payment-status-badge');
    const examBadge = document.getElementById('exam-permit-badge');
    const gradesLocked = document.getElementById('grades-locked');
    const gradesUnlocked = document.getElementById('grades-unlocked');
    const lessonsLocked = document.getElementById('lessons-locked');
    const lessonsUnlocked = document.getElementById('lessons-unlocked');
    const noPermit = document.getElementById('no-permit');
    const hasPermitDiv = document.getElementById('has-permit');

    if (isPaid) {
        if (paymentBadge) {
            paymentBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold status-paid';
            paymentBadge.textContent = '✓ Fully Paid';
        }
        if (examBadge) {
            examBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold status-paid';
            examBadge.textContent = '✓ Exam Permit Active';
        }

        if (gradesLocked) gradesLocked.classList.add('hidden');
        if (gradesUnlocked) gradesUnlocked.classList.remove('hidden');
        if (lessonsLocked) lessonsLocked.classList.add('hidden');
        if (lessonsUnlocked) lessonsUnlocked.classList.remove('hidden');
        if (noPermit) noPermit.classList.add('hidden');
        if (hasPermitDiv) hasPermitDiv.classList.remove('hidden');
    } else {
        if (paymentBadge) {
            paymentBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold status-unpaid';
            paymentBadge.textContent = '⚠️ Unpaid Balance';
        }
        if (examBadge) {
            examBadge.className = 'px-3 py-1 rounded-full text-xs font-semibold status-unpaid';
            examBadge.textContent = '❌ No Exam Permit';
        }

        if (gradesLocked) gradesLocked.classList.remove('hidden');
        if (gradesUnlocked) gradesUnlocked.classList.add('hidden');
        if (lessonsLocked) lessonsLocked.classList.remove('hidden');
        if (lessonsUnlocked) lessonsUnlocked.classList.add('hidden');
        if (noPermit) noPermit.classList.remove('hidden');
        if (hasPermitDiv) hasPermitDiv.classList.add('hidden');
    }
}

// Show Toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
    toast.className = `fixed bottom-4 right-4 px-6 py-3 ${bgColor} text-white rounded-xl shadow-lg z-50 animate-fade`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ==================== INITIALIZATION ====================

// Handle form submission for edit profile (delegation)
document.addEventListener('submit', function(e) {
    if (e.target.id === 'edit-profile-form') {
        e.preventDefault();
        showToast('Profile updated successfully!', 'success');
        navigateTo('profile');
    }
});

// Initialize Element SDK
if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig,
        onConfigChange: async (config) => {
            document.getElementById('system-name').textContent = config.system_name || defaultConfig.system_name;
            document.getElementById('welcome-text').textContent = config.welcome_message || defaultConfig.welcome_message;
        },
        mapToCapabilities: (config) => ({
            recolorables: [
                { get: () => config.primary_color || defaultConfig.primary_color, set: (value) => window.elementSdk.setConfig({ primary_color: value }) },
                { get: () => config.secondary_color || defaultConfig.secondary_color, set: (value) => window.elementSdk.setConfig({ secondary_color: value }) },
                { get: () => config.accent_color || defaultConfig.accent_color, set: (value) => window.elementSdk.setConfig({ accent_color: value }) },
                { get: () => config.text_color || defaultConfig.text_color, set: (value) => window.elementSdk.setConfig({ text_color: value }) },
                { get: () => config.background_color || defaultConfig.background_color, set: (value) => window.elementSdk.setConfig({ background_color: value }) }
            ],
            borderables: [],
            fontEditable: undefined,
            fontSizeable: undefined
        }),
        mapToEditPanelValues: (config) => new Map([
            ['system_name', config.system_name || defaultConfig.system_name],
            ['welcome_message', config.welcome_message || defaultConfig.welcome_message]
        ])
    });
}

// Initialize Data SDK
if (window.dataSdk) {
    const dataHandler = {
        onDataChanged(data) {
            enrolledData = data.filter(d => d.type === 'enrollment');
        }
    };
    window.dataSdk.init(dataHandler);
}

// Initial render and navigation
window.onload = function() {
    // Render all views initially (so they're ready when navigated)
    for (let view in templates) {
        renderView(view);
    }
    navigateTo('dashboard');
    updatePaymentStatus();
    setStudentType('block');
    renderEnrolledSubjects(true);
};