// // Dashboard Script
// // Student Database (from Excel file)
// const STUDENTS_DATABASE = {
//     "Kothanur": {
//         "Daycare": ["Sherilyn Sijipaul"],
//         "PP1": ["Rithwika V", "Xodus", "Chris Robinson", "ADINA A (Kushi Gowda . A)"],
//         "PP2": ["Deekshant Tamang", "Sanvi Ram R", "Bharthi Seervi", "Dhuvika .M", "Priyanshu Das", "Dhaanvi. Y"],
//         "PP3": ["Sathvik  Eshasn .B", "Sreesit Budha"]
//     },
//     "Chellikere": {
//         "Daycare": ["Aaradhya sharma", "Srirangam Adharsh Raj", "Gideon .A", "Sana Gladiya .D", "R. Sudeep", "Tabitha .S", "Trilochan. G", "Rohan Prahlad Sahani", "Krishang .S"],
//         "PP1": ["Aashritha .D", "Aathira .P", "Abhishek william .k", "K. Ananya", "Anwesha Ghara", "Aryan Ali nazar", "Dhakshit. A", "Dhanya. A", "Dhanvika Tirupati", "Nathan Joshua", "Neetish D Raju", "G.S. Ruthisha", "Sashmika. R", "Samrat .A"],
//         "PP2": ["Aakaankshaa .R", "Aden Prince .D", "N. Yasitha", "Hanvika .C", "Prajin. G", "Charvik. G", "Adeteya Kumar", "A. Sansa", "Hazel Rozario", "Erwin Benjamin Felix", "Angel Deborah .P", "Shalem Dhedeep . Raj", "D. lingesh", "Disha Diya Dsouza", "Khushi Mutnal", "Yashas Gowda .H", "Anya Prajapati", "Liam Samuel Jikku", "Daniyal Pariyar", "Anvika Emmanuel .S", "Mokshal .M"],
//         "PP3": ["Advith. K", "Dhanvika .N", "Divyanshi Sharma", "Cheguru Gritik Rama", "J. Hanvika", "Jessica Mikaela .M", "Jeslyn B", "Navyashri", "S. Nithwin Tej", "Rishika Chandra", "Kothapalli Rushil Vedansh", "Ruth Mansianmuang", "Samanvitha. M", "Vedanth .G", "Yalamakuri Yashwin", "Mannam Yeshashwi", "Nelson .A", "Leeya .RK", "Deborah James"]
//     }
// };

// // State management
// let currentBranch = '';
// let currentClass = '';
// let currentStudent = null;
// let studentAttendance = [];
// let studentNotes = [];

// // DOM Elements
// const branchSelect = document.getElementById('branchSelect');
// const classSelect = document.getElementById('classSelect');
// const studentsGrid = document.getElementById('studentsGrid');
// const studentsList = document.getElementById('studentsList');
// const selectionSection = document.getElementById('selectionSection');
// const dashboardSection = document.getElementById('dashboardSection');
// const toast = document.getElementById('toast');

// // Initialize
// document.addEventListener('DOMContentLoaded', () => {
//     // Set current date
//     const today = new Date();
//     const dateStr = today.toLocaleDateString('en-IN', {
//         weekday: 'short',
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//     });
//     document.getElementById('currentDate').textContent = dateStr;

//     // Event listeners
//     branchSelect.addEventListener('change', handleBranchChange);
//     classSelect.addEventListener('change', handleClassChange);
    
//     // Note form submission
//     document.getElementById('noteForm').addEventListener('submit', handleNoteSubmit);
    
//     // Image preview
//     document.getElementById('noteImages').addEventListener('change', handleImagePreview);
// });

// // Branch selection handler
// function handleBranchChange(e) {
//     currentBranch = e.target.value;
//     classSelect.disabled = false;
//     classSelect.value = '';
//     studentsGrid.style.display = 'none';
    
//     if (currentBranch) {
//         // Populate class dropdown
//         const classes = Object.keys(STUDENTS_DATABASE[currentBranch]);
//         classSelect.innerHTML = '<option value="">-- Select Class --</option>';
//         classes.forEach(cls => {
//             const option = document.createElement('option');
//             option.value = cls;
//             option.textContent = cls;
//             classSelect.appendChild(option);
//         });
//     } else {
//         classSelect.disabled = true;
//         classSelect.innerHTML = '<option value="">-- Select Class --</option>';
//     }
// }

// // Class selection handler
// function handleClassChange(e) {
//     currentClass = e.target.value;
    
//     if (currentClass) {
//         loadStudents();
//     } else {
//         studentsGrid.style.display = 'none';
//     }
// }

// // Load students for selected branch and class
// function loadStudents() {
//     const students = STUDENTS_DATABASE[currentBranch][currentClass] || [];
    
//     if (students.length === 0) {
//         showToast('No students found for this class', 'error');
//         return;
//     }
    
//     studentsList.innerHTML = students.map((student, index) => `
//         <div class="student-card" onclick="selectStudent('${student}', ${index + 1})">
//             <div class="student-card-icon">
//                 <i class="fas fa-user-circle"></i>
//             </div>
//             <h4>${student}</h4>
//             <div class="student-card-meta">
//                 Roll No: ${index + 1} • ${currentClass}
//             </div>
//         </div>
//     `).join('');
    
//     studentsGrid.style.display = 'block';
// }

// // Select student and show dashboard
// async function selectStudent(name, rollNo) {
//     currentStudent = {
//         name: name,
//         rollNo: rollNo,
//         class: currentClass,
//         branch: currentBranch
//     };
    
//     // Hide selection, show dashboard
//     selectionSection.style.display = 'none';
//     dashboardSection.style.display = 'block';
    
//     // Update student info
//     document.getElementById('studentName').textContent = name;
//     document.getElementById('studentRoll').textContent = rollNo;
//     document.getElementById('studentClass').textContent = currentClass;
//     document.getElementById('studentBranch').textContent = currentBranch;
    
//     // Load attendance data
//     await loadAttendanceData();
    
//     // Load notes
//     loadNotes();
    
//     // Scroll to top
//     window.scrollTo(0, 0);
// }

// // Load attendance data from database
// async function loadAttendanceData() {
//     try {
//         const response = await fetch(`../api/get-attendance.php?rollno=${currentStudent.rollNo}&class=${currentStudent.class}&branch=${currentStudent.branch}`);
//         const data = await response.json();
        
//         if (data.success) {
//             studentAttendance = data.attendance;
//             updateAttendanceStats();
//             renderAttendanceList();
//         } else {
//             showToast('Error loading attendance data', 'error');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         showToast('Network error. Please try again.', 'error');
//     }
// }

// // Update attendance statistics
// function updateAttendanceStats() {
//     const presentDays = studentAttendance.filter(a => a.status === 'Present').length;
//     const absentDays = studentAttendance.filter(a => a.status === 'Absent').length;
//     const totalDays = studentAttendance.length;
//     const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;
    
//     document.getElementById('presentCount').textContent = presentDays;
//     document.getElementById('absentCount').textContent = absentDays;
//     document.getElementById('totalDays').textContent = totalDays;
//     document.getElementById('attendancePercentage').textContent = percentage + '%';
// }

// // Render attendance list
// function renderAttendanceList() {
//     const listHtml = studentAttendance.length > 0 
//         ? studentAttendance.map(record => `
//             <div class="attendance-item">
//                 <span class="attendance-date">${formatDate(record.date)}</span>
//                 <span class="attendance-status ${record.status === 'Present' ? 'status-present' : 'status-absent'}">
//                     ${record.status}
//                 </span>
//             </div>
//         `).join('')
//         : '<div class="no-notes">No attendance records found</div>';
    
//     document.getElementById('attendanceList').innerHTML = listHtml;
// }

// // Toggle between list and calendar view
// function toggleView(view) {
//     const listView = document.getElementById('attendanceList');
//     const calendarView = document.getElementById('attendanceCalendar');
//     const buttons = document.querySelectorAll('.btn-toggle');
    
//     buttons.forEach(btn => {
//         btn.classList.toggle('active', btn.dataset.view === view);
//     });
    
//     if (view === 'list') {
//         listView.style.display = 'block';
//         calendarView.style.display = 'none';
//     } else {
//         listView.style.display = 'none';
//         calendarView.style.display = 'grid';
//         renderAttendanceCalendar();
//     }
// }

// // Render attendance calendar
// function renderAttendanceCalendar() {
//     const calendar = document.getElementById('attendanceCalendar');
//     const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
//     let html = daysOfWeek.map(day => `
//         <div class="calendar-day empty" style="background: #f7fafc; font-weight: 700;">${day}</div>
//     `).join('');
    
//     // Get current month's data
//     const today = new Date();
//     const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
//     const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
//     // Add empty cells for days before month starts
//     for (let i = 0; i < firstDay.getDay(); i++) {
//         html += '<div class="calendar-day empty"></div>';
//     }
    
//     // Add days of the month
//     for (let day = 1; day <= lastDay.getDate(); day++) {
//         const date = new Date(today.getFullYear(), today.getMonth(), day);
//         const dateStr = date.toISOString().split('T')[0];
//         const record = studentAttendance.find(a => a.date === dateStr);
        
//         const className = record 
//             ? (record.status === 'Present' ? 'present' : 'absent')
//             : 'empty';
        
//         html += `<div class="calendar-day ${className}" title="${record ? record.status : 'No record'}">${day}</div>`;
//     }
    
//     calendar.innerHTML = html;
// }

// // Load notes (from localStorage for demo)
// function loadNotes() {
//     const notesKey = `notes_${currentStudent.rollNo}_${currentStudent.class}_${currentStudent.branch}`;
//     const savedNotes = localStorage.getItem(notesKey);
//     studentNotes = savedNotes ? JSON.parse(savedNotes) : [];
//     renderNotes();
// }

// // Render notes
// function renderNotes() {
//     const notesHtml = studentNotes.length > 0
//         ? studentNotes.map(note => `
//             <div class="note-item">
//                 <div class="note-header">
//                     <span class="note-date">${formatDate(note.date)}</span>
//                 </div>
//                 <div class="note-text">${note.text}</div>
//                 ${note.images && note.images.length > 0 ? `
//                     <div class="note-images">
//                         ${note.images.map(img => `
//                             <img src="${img}" alt="Note image" class="note-image" onclick="viewImage('${img}')">
//                         `).join('')}
//                     </div>
//                 ` : ''}
//             </div>
//         `).join('')
//         : '<div class="no-notes">No notes yet. Teachers can add notes and updates here.</div>';
    
//     document.getElementById('notesList').innerHTML = notesHtml;
// }

// // Open note modal
// function openNoteModal() {
//     document.getElementById('noteModal').classList.add('open');
// }

// // Close note modal
// function closeNoteModal() {
//     document.getElementById('noteModal').classList.remove('open');
//     document.getElementById('noteForm').reset();
//     document.getElementById('imagePreview').innerHTML = '';
// }

// // Handle image preview
// function handleImagePreview(e) {
//     const files = Array.from(e.target.files);
//     const preview = document.getElementById('imagePreview');
    
//     preview.innerHTML = '';
    
//     files.forEach(file => {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//             const img = document.createElement('img');
//             img.src = e.target.result;
//             img.className = 'preview-image';
//             preview.appendChild(img);
//         };
//         reader.readAsDataURL(file);
//     });
// }

// // Handle note submission
// function handleNoteSubmit(e) {
//     e.preventDefault();
    
//     const noteText = document.getElementById('noteText').value;
//     const imageFiles = document.getElementById('noteImages').files;
    
//     // Convert images to base64
//     const imagePromises = Array.from(imageFiles).map(file => {
//         return new Promise((resolve) => {
//             const reader = new FileReader();
//             reader.onload = (e) => resolve(e.target.result);
//             reader.readAsDataURL(file);
//         });
//     });
    
//     Promise.all(imagePromises).then(images => {
//         const newNote = {
//             id: Date.now(),
//             date: new Date().toISOString().split('T')[0],
//             text: noteText,
//             images: images
//         };
        
//         studentNotes.unshift(newNote);
        
//         // Save to localStorage
//         const notesKey = `notes_${currentStudent.rollNo}_${currentStudent.class}_${currentStudent.branch}`;
//         localStorage.setItem(notesKey, JSON.stringify(studentNotes));
        
//         renderNotes();
//         closeNoteModal();
//         showToast('Note added successfully!', 'success');
//     });
// }

// // View image in full size
// function viewImage(src) {
//     window.open(src, '_blank');
// }

// // Go back to selection
// function goBack() {
//     dashboardSection.style.display = 'none';
//     selectionSection.style.display = 'block';
//     currentStudent = null;
// }

// // Format date
// function formatDate(dateStr) {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('en-IN', {
//         weekday: 'short',
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//     });
// }

// // Show toast notification
// function showToast(message, type = 'info') {
//     toast.textContent = message;
//     toast.className = 'toast show ' + type;
    
//     setTimeout(() => {
//         toast.classList.remove('show');
//     }, 4000);
// }

// console.log('Personal Dashboard loaded successfully!');





// Dashboard Script
// Student Database (from Excel file)
const STUDENTS_DATABASE = {
    "Kothanur": {
        "Daycare": ["Sherilyn Sijipaul"],
        "PP1": ["Rithwika V", "Xodus", "Chris Robinson", "ADINA A (Kushi Gowda . A)"],
        "PP2": ["Deekshant Tamang", "Sanvi Ram R", "Bharthi Seervi", "Dhuvika .M", "Priyanshu Das", "Dhaanvi. Y"],
        "PP3": ["Sathvik  Eshasn .B", "Sreesit Budha"]
    },
    "Chellikere": {
        "Daycare": ["Aaradhya sharma", "Srirangam Adharsh Raj", "Gideon .A", "Sana Gladiya .D", "R. Sudeep", "Tabitha .S", "Trilochan. G", "Rohan Prahlad Sahani", "Krishang .S"],
        "PP1": ["Aashritha .D", "Aathira .P", "Abhishek william .k", "K. Ananya", "Anwesha Ghara", "Aryan Ali nazar", "Dhakshit. A", "Dhanya. A", "Dhanvika Tirupati", "Nathan Joshua", "Neetish D Raju", "G.S. Ruthisha", "Sashmika. R", "Samrat .A"],
        "PP2": ["Aakaankshaa .R", "Aden Prince .D", "N. Yasitha", "Hanvika .C", "Prajin. G", "Charvik. G", "Adeteya Kumar", "A. Sansa", "Hazel Rozario", "Erwin Benjamin Felix", "Angel Deborah .P", "Shalem Dhedeep . Raj", "D. lingesh", "Disha Diya Dsouza", "Khushi Mutnal", "Yashas Gowda .H", "Anya Prajapati", "Liam Samuel Jikku", "Daniyal Pariyar", "Anvika Emmanuel .S", "Mokshal .M"],
        "PP3": ["Advith. K", "Dhanvika .N", "Divyanshi Sharma", "Cheguru Gritik Rama", "J. Hanvika", "Jessica Mikaela .M", "Jeslyn B", "Navyashri", "S. Nithwin Tej", "Rishika Chandra", "Kothapalli Rushil Vedansh", "Ruth Mansianmuang", "Samanvitha. M", "Vedanth .G", "Yalamakuri Yashwin", "Mannam Yeshashwi", "Nelson .A", "Leeya .RK", "Deborah James"]
    }
};

// Curriculum for each class (Weekly Topics)
const CURRICULUM = {
    "Daycare": [
        { week: 1, topics: ["Basic Colors Recognition", "Simple Shapes", "Motor Skills - Grasping"] },
        { week: 2, topics: ["Numbers 1-5", "Animal Sounds", "Social Play Activities"] },
        { week: 3, topics: ["Body Parts", "Big and Small", "Music & Movement"] },
        { week: 4, topics: ["Fruits Recognition", "Day & Night", "Sensory Activities"] }
    ],
    "PP1": [
        { week: 1, topics: ["Alphabet A-E", "Numbers 1-10", "Colors - Primary", "Shapes - Basic"] },
        { week: 2, topics: ["Alphabet F-J", "Counting 11-20", "Animals - Domestic", "Size Comparison"] },
        { week: 3, topics: ["Alphabet K-O", "Simple Addition", "Fruits & Vegetables", "Weather Concepts"] },
        { week: 4, topics: ["Alphabet P-T", "Simple Subtraction", "Body Parts", "Family Members"] },
        { week: 5, topics: ["Alphabet U-Z", "Pattern Recognition", "Seasons", "Transportation"] }
    ],
    "PP2": [
        { week: 1, topics: ["Phonics - Vowel Sounds", "Numbers 1-50", "Living & Non-living", "Story Reading"] },
        { week: 2, topics: ["Two-letter Words", "Addition 1-20", "Plants Parts", "Community Helpers"] },
        { week: 3, topics: ["Three-letter Words", "Subtraction 1-20", "Water Cycle", "Good Habits"] },
        { week: 4, topics: ["Simple Sentences", "Skip Counting", "Solar System Intro", "Safety Rules"] },
        { week: 5, topics: ["Rhyming Words", "Time - Hours", "Healthy Food", "Environmental Care"] }
    ],
    "PP3": [
        { week: 1, topics: ["Reading Comprehension", "Numbers 1-100", "Science - Solids & Liquids", "Writing Practice"] },
        { week: 2, topics: ["Sentence Formation", "Multiplication Tables 2-5", "Human Body Systems", "Creative Writing"] },
        { week: 3, topics: ["Grammar - Nouns", "Division Basics", "Plants & Photosynthesis", "Cursive Writing"] },
        { week: 4, topics: ["Grammar - Verbs", "Fractions Introduction", "Simple Machines", "Essay Writing"] },
        { week: 5, topics: ["Punctuation", "Money Concepts", "Weather & Climate", "Story Composition"] },
        { week: 6, topics: ["Comprehension Passages", "Measurements", "Animal Habitats", "Poetry Writing"] }
    ]
};

// State management
let currentBranch = '';
let currentClass = '';
let currentStudent = null;
let studentAttendance = [];
let studentNotes = [];
let studentCurriculum = {};
let progressChart = null;

// DOM Elements
const branchSelect = document.getElementById('branchSelect');
const classSelect = document.getElementById('classSelect');
const studentsGrid = document.getElementById('studentsGrid');
const studentsList = document.getElementById('studentsList');
const selectionSection = document.getElementById('selectionSection');
const dashboardSection = document.getElementById('dashboardSection');
const toast = document.getElementById('toast');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set current date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    document.getElementById('currentDate').textContent = dateStr;

    // Event listeners
    branchSelect.addEventListener('change', handleBranchChange);
    classSelect.addEventListener('change', handleClassChange);
    
    // Note form submission
    document.getElementById('noteForm').addEventListener('submit', handleNoteSubmit);
    
    // Image preview
    document.getElementById('noteImages').addEventListener('change', handleImagePreview);
});

// Branch selection handler
function handleBranchChange(e) {
    currentBranch = e.target.value;
    classSelect.disabled = false;
    classSelect.value = '';
    studentsGrid.style.display = 'none';
    
    if (currentBranch) {
        // Populate class dropdown
        const classes = Object.keys(STUDENTS_DATABASE[currentBranch]);
        classSelect.innerHTML = '<option value="">-- Select Class --</option>';
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls;
            option.textContent = cls;
            classSelect.appendChild(option);
        });
    } else {
        classSelect.disabled = true;
        classSelect.innerHTML = '<option value="">-- Select Class --</option>';
    }
}

// Class selection handler
function handleClassChange(e) {
    currentClass = e.target.value;
    
    if (currentClass) {
        loadStudents();
    } else {
        studentsGrid.style.display = 'none';
    }
}

// Load students for selected branch and class
function loadStudents() {
    const students = STUDENTS_DATABASE[currentBranch][currentClass] || [];
    
    if (students.length === 0) {
        showToast('No students found for this class', 'error');
        return;
    }
    
    studentsList.innerHTML = students.map((student, index) => `
        <div class="student-card" onclick="selectStudent('${student}', ${index + 1})">
            <div class="student-card-icon">
                <i class="fas fa-user-circle"></i>
            </div>
            <h4>${student}</h4>
            <div class="student-card-meta">
                Roll No: ${index + 1} • ${currentClass}
            </div>
        </div>
    `).join('');
    
    studentsGrid.style.display = 'block';
}

// Select student and show dashboard
async function selectStudent(name, rollNo) {
    currentStudent = {
        name: name,
        rollNo: rollNo,
        class: currentClass,
        branch: currentBranch
    };
    
    // Hide selection, show dashboard
    selectionSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    
    // Update student info
    document.getElementById('studentName').textContent = name;
    document.getElementById('studentRoll').textContent = rollNo;
    document.getElementById('studentClass').textContent = currentClass;
    document.getElementById('studentBranch').textContent = currentBranch;
    
    // Load attendance data
    await loadAttendanceData();
    
    // Load notes
    loadNotes();
    
    // Load curriculum progress
    loadCurriculum();
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Load attendance data from database
async function loadAttendanceData() {
    try {
        const response = await fetch(`../api/get-attendance.php?rollno=${currentStudent.rollNo}&class=${currentStudent.class}&branch=${currentStudent.branch}`);
        const data = await response.json();
        
        if (data.success) {
            studentAttendance = data.attendance;
            updateAttendanceStats();
            renderAttendanceList();
        } else {
            showToast('Error loading attendance data', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Network error. Please try again.', 'error');
    }
}

// Update attendance statistics
function updateAttendanceStats() {
    const presentDays = studentAttendance.filter(a => a.status === 'Present').length;
    const absentDays = studentAttendance.filter(a => a.status === 'Absent').length;
    const totalDays = studentAttendance.length;
    const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;
    
    document.getElementById('presentCount').textContent = presentDays;
    document.getElementById('absentCount').textContent = absentDays;
    document.getElementById('totalDays').textContent = totalDays;
    document.getElementById('attendancePercentage').textContent = percentage + '%';
}

// Render attendance list
function renderAttendanceList() {
    const listHtml = studentAttendance.length > 0 
        ? studentAttendance.map(record => `
            <div class="attendance-item">
                <span class="attendance-date">${formatDate(record.date)}</span>
                <span class="attendance-status ${record.status === 'Present' ? 'status-present' : 'status-absent'}">
                    ${record.status}
                </span>
            </div>
        `).join('')
        : '<div class="no-notes">No attendance records found</div>';
    
    document.getElementById('attendanceList').innerHTML = listHtml;
}

// Toggle between list and calendar view
function toggleView(view) {
    const listView = document.getElementById('attendanceList');
    const calendarView = document.getElementById('attendanceCalendar');
    const buttons = document.querySelectorAll('.btn-toggle');
    
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    if (view === 'list') {
        listView.style.display = 'block';
        calendarView.style.display = 'none';
    } else {
        listView.style.display = 'none';
        calendarView.style.display = 'grid';
        renderAttendanceCalendar();
    }
}

// Render attendance calendar
function renderAttendanceCalendar() {
    const calendar = document.getElementById('attendanceCalendar');
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    let html = daysOfWeek.map(day => `
        <div class="calendar-day empty" style="background: #f7fafc; font-weight: 700;">${day}</div>
    `).join('');
    
    // Get current month's data
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay.getDay(); i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(today.getFullYear(), today.getMonth(), day);
        const dateStr = date.toISOString().split('T')[0];
        const record = studentAttendance.find(a => a.date === dateStr);
        
        const className = record 
            ? (record.status === 'Present' ? 'present' : 'absent')
            : 'empty';
        
        html += `<div class="calendar-day ${className}" title="${record ? record.status : 'No record'}">${day}</div>`;
    }
    
    calendar.innerHTML = html;
}

// Load notes (from localStorage for demo)
function loadNotes() {
    const notesKey = `notes_${currentStudent.rollNo}_${currentStudent.class}_${currentStudent.branch}`;
    const savedNotes = localStorage.getItem(notesKey);
    studentNotes = savedNotes ? JSON.parse(savedNotes) : [];
    renderNotes();
}

// Render notes
function renderNotes() {
    const notesHtml = studentNotes.length > 0
        ? studentNotes.map(note => `
            <div class="note-item">
                <div class="note-header">
                    <span class="note-date">${formatDate(note.date)}</span>
                </div>
                <div class="note-text">${note.text}</div>
                ${note.images && note.images.length > 0 ? `
                    <div class="note-images">
                        ${note.images.map(img => `
                            <img src="${img}" alt="Note image" class="note-image" onclick="viewImage('${img}')">
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('')
        : '<div class="no-notes">No notes yet. Teachers can add notes and updates here.</div>';
    
    document.getElementById('notesList').innerHTML = notesHtml;
}

// Open note modal
function openNoteModal() {
    document.getElementById('noteModal').classList.add('open');
}

// Close note modal
function closeNoteModal() {
    document.getElementById('noteModal').classList.remove('open');
    document.getElementById('noteForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
}

// Handle image preview
function handleImagePreview(e) {
    const files = Array.from(e.target.files);
    const preview = document.getElementById('imagePreview');
    
    preview.innerHTML = '';
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

// Handle note submission
function handleNoteSubmit(e) {
    e.preventDefault();
    
    const noteText = document.getElementById('noteText').value;
    const imageFiles = document.getElementById('noteImages').files;
    
    // Convert images to base64
    const imagePromises = Array.from(imageFiles).map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    });
    
    Promise.all(imagePromises).then(images => {
        const newNote = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            text: noteText,
            images: images
        };
        
        studentNotes.unshift(newNote);
        
        // Save to localStorage
        const notesKey = `notes_${currentStudent.rollNo}_${currentStudent.class}_${currentStudent.branch}`;
        localStorage.setItem(notesKey, JSON.stringify(studentNotes));
        
        renderNotes();
        closeNoteModal();
        showToast('Note added successfully!', 'success');
    });
}

// View image in full size
function viewImage(src) {
    window.open(src, '_blank');
}

// ========== CURRICULUM FUNCTIONS ==========

// Load curriculum progress
function loadCurriculum() {
    const curriculumKey = `curriculum_${currentStudent.rollNo}_${currentStudent.class}_${currentStudent.branch}`;
    const savedProgress = localStorage.getItem(curriculumKey);
    studentCurriculum = savedProgress ? JSON.parse(savedProgress) : {};
    
    updateCurriculumChart();
}

// Open curriculum modal
function openCurriculumModal() {
    document.getElementById('curriculumStudentName').textContent = currentStudent.name;
    document.getElementById('curriculumClass').textContent = currentStudent.class;
    
    renderCurriculumForm();
    document.getElementById('curriculumModal').classList.add('open');
}

// Close curriculum modal
function closeCurriculumModal() {
    document.getElementById('curriculumModal').classList.remove('open');
}

// Render curriculum form with weeks and topics
function renderCurriculumForm() {
    const curriculum = CURRICULUM[currentStudent.class] || [];
    const weeksContainer = document.getElementById('curriculumWeeks');
    
    weeksContainer.innerHTML = curriculum.map((week, weekIndex) => `
        <div class="week-section">
            <div class="week-header">
                <i class="fas fa-calendar-week"></i>
                Week ${week.week}
            </div>
            <div class="week-topics">
                ${week.topics.map((topic, topicIndex) => {
                    const key = `week${week.week}_topic${topicIndex}`;
                    const isCompleted = studentCurriculum[key] === 'completed';
                    
                    return `
                        <div class="topic-item">
                            <input 
                                type="checkbox" 
                                id="${key}" 
                                class="topic-checkbox"
                                ${isCompleted ? 'checked' : ''}
                                onchange="toggleTopicStatus('${key}', this.checked)"
                            >
                            <label for="${key}" class="topic-label">${topic}</label>
                            <div class="topic-status">
                                <span class="status-badge ${isCompleted ? 'completed' : 'incomplete'}">
                                    ${isCompleted ? '✓ Completed' : '○ Incomplete'}
                                </span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `).join('');
    
    // Add form submit handler
    document.getElementById('curriculumForm').onsubmit = handleCurriculumSubmit;
}

// Toggle topic status
function toggleTopicStatus(key, isChecked) {
    studentCurriculum[key] = isChecked ? 'completed' : 'incomplete';
}

// Handle curriculum form submission
function handleCurriculumSubmit(e) {
    e.preventDefault();
    
    // Save to localStorage
    const curriculumKey = `curriculum_${currentStudent.rollNo}_${currentStudent.class}_${currentStudent.branch}`;
    localStorage.setItem(curriculumKey, JSON.stringify(studentCurriculum));
    
    // Update chart
    updateCurriculumChart();
    
    closeCurriculumModal();
    showToast('Curriculum progress updated successfully!', 'success');
}

// Update curriculum chart (Half Pie Chart)
function updateCurriculumChart() {
    const curriculum = CURRICULUM[currentStudent.class] || [];
    let totalTopics = 0;
    let completedTopics = 0;
    
    // Count total and completed topics
    curriculum.forEach((week, weekIndex) => {
        week.topics.forEach((topic, topicIndex) => {
            totalTopics++;
            const key = `week${week.week}_topic${topicIndex}`;
            if (studentCurriculum[key] === 'completed') {
                completedTopics++;
            }
        });
    });
    
    const incompleteTopics = totalTopics - completedTopics;
    const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    
    // Update stats
    document.getElementById('completedTopics').textContent = completedTopics;
    document.getElementById('incompleteTopics').textContent = incompleteTopics;
    document.getElementById('totalTopics').textContent = totalTopics;
    document.getElementById('progressPercentage').textContent = percentage + '%';
    
    // Create or update chart
    const ctx = document.getElementById('progressChart');
    
    if (progressChart) {
        progressChart.destroy();
    }
    
    progressChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Incomplete'],
            datasets: [{
                data: [completedTopics, incompleteTopics],
                backgroundColor: [
                    'rgba(107, 207, 127, 0.8)',
                    'rgba(255, 215, 61, 0.8)'
                ],
                borderColor: [
                    'rgba(107, 207, 127, 1)',
                    'rgba(255, 215, 61, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            circumference: 180,
            rotation: 270,
            cutout: '70%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14,
                            family: "'Segoe UI', sans-serif"
                        },
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${label}: ${value} topics (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Go back to selection
function goBack() {
    dashboardSection.style.display = 'none';
    selectionSection.style.display = 'block';
    currentStudent = null;
    
    if (progressChart) {
        progressChart.destroy();
        progressChart = null;
    }
}

// Format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show toast notification
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

console.log('Personal Dashboard loaded successfully!');