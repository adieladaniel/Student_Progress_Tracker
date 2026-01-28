// attendance-script.js - Common script for all attendance pages

// Auto-detect class from body data attribute
const CLASS_NAME = document.body.dataset.class;

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

// Date setup
const today = new Date();
const todayStr = today.toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
});
const todayISO = today.toISOString().split('T')[0];

document.getElementById('todayDate').textContent = todayStr;
document.getElementById('modalDate').textContent = todayStr;

// DOM elements
const branchSelect = document.getElementById('branchSelect');
const attendanceSection = document.getElementById('attendanceSection');
const studentListEl = document.getElementById('studentList');
const form = document.getElementById('attendanceForm');
const modal = document.getElementById('absentModal');
const absentList = document.getElementById('absentList');
const noAbsNote = document.getElementById('noAbsenteesNote');
const modalClose = document.getElementById('modalClose');
const modalConfirm = document.getElementById('modalConfirm');
const toast = document.getElementById('toast');
const selectedBranchSpan = document.getElementById('selectedBranch');
const studentCountSpan = document.getElementById('studentCount');
const modalBranchSpan = document.getElementById('modalBranch');

let currentBranch = '';
let currentStudents = [];

// Branch selection handler
branchSelect.addEventListener('change', (e) => {
    currentBranch = e.target.value;
    
    if (currentBranch) {
        loadStudentsForBranch(currentBranch);
        attendanceSection.style.display = 'block';
        selectedBranchSpan.textContent = currentBranch;
        modalBranchSpan.textContent = currentBranch;
    } else {
        attendanceSection.style.display = 'none';
        form.reset();
    }
});

// Load students for selected branch
function loadStudentsForBranch(branch) {
    currentStudents = STUDENTS_DATABASE[branch][CLASS_NAME] || [];
    
    if (currentStudents.length === 0) {
        studentListEl.innerHTML = '<li class="no-students">No students found for this class in ' + branch + ' branch.</li>';
        studentCountSpan.textContent = '0';
        return;
    }
    
    studentCountSpan.textContent = currentStudents.length;
    
    studentListEl.innerHTML = currentStudents.map((student, index) => `
        <li class="student-row">
            <span class="student-name">${student}</span>
            <label class="absent-toggle">
                <span>Absent</span>
                <input type="checkbox" 
                       name="student" 
                       value="${index + 1}" 
                       data-name="${student}"
                       data-rollno="${index + 1}">
            </label>
        </li>
    `).join('');
}

// Form submit - show modal
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentBranch) {
        showToast('Please select a branch first', 'error');
        return;
    }
    
    absentList.innerHTML = '';
    noAbsNote.textContent = '';

    const checkboxes = form.querySelectorAll('input[name="student"]:checked');
    
    if (checkboxes.length === 0) {
        noAbsNote.textContent = '🎉 Great! No absentees today.';
    } else {
        checkboxes.forEach(checkbox => {
            const li = document.createElement('li');
            li.textContent = checkbox.dataset.name;
            absentList.appendChild(li);
        });
    }

    modal.classList.add('open');
});

// Modal close
modalClose.addEventListener('click', () => {
    modal.classList.remove('open');
});

// Confirm and save
modalConfirm.addEventListener('click', async () => {
    modalConfirm.disabled = true;
    modalConfirm.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    try {
        const attendanceRecords = [];
        
        currentStudents.forEach((student, index) => {
            const checkbox = form.querySelector(`input[value="${index + 1}"]`);
            const isAbsent = checkbox ? checkbox.checked : false;

            attendanceRecords.push({
                date: todayISO,
                rollno: index + 1,
                name: student,
                class: CLASS_NAME,
                branch: currentBranch,
                status: isAbsent ? 'Absent' : 'Present'
            });
        });

        // Send to server
        const response = await fetch('../api/save-attendance.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                records: attendanceRecords
            })
        });

        const data = await response.json();

        if (data.success) {
            showToast(`✓ Attendance saved successfully for ${CLASS_NAME} - ${currentBranch}!`, 'success');
            modal.classList.remove('open');
            
            setTimeout(() => {
                form.reset();
                clearSelection();
            }, 1500);
        } else {
            showToast('Error: ' + data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Network error. Please try again.', 'error');
    } finally {
        modalConfirm.disabled = false;
        modalConfirm.innerHTML = '<i class="fas fa-save"></i> Confirm &amp; Save';
    }
});

// Clear selection function
function clearSelection() {
    form.reset();
    branchSelect.value = '';
    currentBranch = '';
    attendanceSection.style.display = 'none';
}

// Toast notification
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('open');
    }
});

console.log(`Attendance system loaded for ${CLASS_NAME}`);
