// Firebase Configuration
const firebaseConfig = {
    // Replace with your Firebase config
    apiKey: "AIzaSyA6xriXjElUBkYIB1qMyLeuMhyCFxNnCeM",
    authDomain: "gfkfgkfk.firebaseapp.com",
    projectId: "gfkfgkfk",
    storageBucket: "gfkfgkfk.firebasestorage.app",
    messagingSenderId: "195888510997",
    appId: "1:195888510997:web:a2f81b4c427aa4d660b61c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authModal = document.getElementById('authModal');
const closeModal = document.querySelector('.close');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const heroJoin = document.getElementById('heroJoin');

// Member management elements
const totalMembersEl = document.getElementById('totalMembers');
const pendingApprovalsEl = document.getElementById('pendingApprovals');
const activeMembersEl = document.getElementById('activeMembers');
const membersListEl = document.getElementById('membersList');
const pendingListEl = document.getElementById('pendingList');
const pendingApplicationsEl = document.getElementById('pendingApplications');

// Current user
let currentUser = null;

// Authentication State Observer
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        logoutBtn.style.display = 'block';

        // Check if user is approved
        const userDoc = await db.collection('members').doc(user.uid).get();
        if (userDoc.exists && userDoc.data().approved) {
            loadMemberData();
        }
    } else {
        currentUser = null;
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
});

// Modal Controls
loginBtn.addEventListener('click', () => {
    authModal.style.display = 'block';
    showLoginForm();
});

signupBtn.addEventListener('click', () => {
    authModal.style.display = 'block';
    showSignupForm();
});

heroJoin.addEventListener('click', () => {
    authModal.style.display = 'block';
    showSignupForm();
});

closeModal.addEventListener('click', () => {
    authModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.style.display = 'none';
    }
});

showSignup.addEventListener('click', showSignupForm);
showLogin.addEventListener('click', showLoginForm);

function showLoginForm() {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
}

function showSignupForm() {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
}

// Login Functionality
document.getElementById('loginSubmit').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        authModal.style.display = 'none';
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});

// Signup Functionality
document.getElementById('signupSubmit').addEventListener('click', async () => {
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const reason = document.getElementById('signupReason').value;

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Create member application
        await db.collection('members').doc(user.uid).set({
            username: username,
            email: email,
            reason: reason,
            approved: false,
            rank: 'pending',
            joinDate: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert('Application submitted! Please wait for approval from leadership.');
        authModal.style.display = 'none';
    } catch (error) {
        alert('Signup failed: ' + error.message);
    }
});

// Logout Functionality
logoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
    } catch (error) {
        alert('Logout failed: ' + error.message);
    }
});

// Load Member Data
async function loadMemberData() {
    try {
        // Load stats
        const membersSnapshot = await db.collection('members').get();
        const approvedMembers = membersSnapshot.docs.filter(doc => doc.data().approved);
        const pendingMembers = membersSnapshot.docs.filter(doc => !doc.data().approved);

        totalMembersEl.textContent = approvedMembers.length;
        pendingApprovalsEl.textContent = pendingMembers.length;
        activeMembersEl.textContent = approvedMembers.filter(doc => doc.data().lastActive).length;

        // Load approved members
        loadMembers(approvedMembers);

        // Check if current user is admin/mod and show pending applications
        const currentUserDoc = await db.collection('members').doc(currentUser.uid).get();
        if (currentUserDoc.exists) {
            const userData = currentUserDoc.data();
            if (userData.rank === 'owner' || userData.rank === 'mod') {
                loadPendingApplications(pendingMembers);
                pendingListEl.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error loading member data:', error);
    }
}

function loadMembers(members) {
    membersListEl.innerHTML = '';

    members.forEach(memberDoc => {
        const member = memberDoc.data();
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';

        memberCard.innerHTML = `
            <div class="member-rank ${member.rank}">${member.rank.toUpperCase()}</div>
            <h4>${member.username}</h4>
            <p>Joined: ${member.joinDate ? member.joinDate.toDate().toLocaleDateString() : 'Unknown'}</p>
        `;

        membersListEl.appendChild(memberCard);
    });
}

function loadPendingApplications(pendingMembers) {
    pendingApplicationsEl.innerHTML = '';

    pendingMembers.forEach(memberDoc => {
        const member = memberDoc.data();
        const applicationDiv = document.createElement('div');
        applicationDiv.className = 'pending-application';

        applicationDiv.innerHTML = `
            <h4>${member.username}</h4>
            <p><strong>Email:</strong> ${member.email}</p>
            <p><strong>Reason:</strong> ${member.reason}</p>
            <div class="application-actions">
                <button class="approve-btn" onclick="approveMember('${memberDoc.id}')">Approve</button>
                <button class="reject-btn" onclick="rejectMember('${memberDoc.id}')">Reject</button>
            </div>
        `;

        pendingApplicationsEl.appendChild(applicationDiv);
    });
}

// Admin Functions
async function approveMember(memberId) {
    try {
        // Get member data to determine rank
        const memberDoc = await db.collection('members').doc(memberId).get();
        const memberData = memberDoc.data();

        // Assign rank based on some criteria (you can customize this)
        let rank = 'low'; // Default rank

        // Simple rank assignment logic (customize as needed)
        if (memberData.email.includes('admin') || memberData.username.toLowerCase().includes('admin')) {
            rank = 'mod';
        } else if (memberData.reason && memberData.reason.length > 100) {
            rank = 'mid'; // More detailed applications get mid rank
        }

        await db.collection('members').doc(memberId).update({
            approved: true,
            rank: rank,
            approvedDate: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert(`Member approved with rank: ${rank}`);
        loadMemberData(); // Refresh the data
    } catch (error) {
        alert('Error approving member: ' + error.message);
    }
}

async function rejectMember(memberId) {
    try {
        await db.collection('members').doc(memberId).delete();
        alert('Member application rejected and removed.');
        loadMemberData(); // Refresh the data
    } catch (error) {
        alert('Error rejecting member: ' + error.message);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Load public member stats (without authentication)
    loadPublicStats();
});

async function loadPublicStats() {
    try {
        const membersSnapshot = await db.collection('members').where('approved', '==', true).get();
        totalMembersEl.textContent = membersSnapshot.size;
    } catch (error) {
        console.error('Error loading public stats:', error);
        totalMembersEl.textContent = '150'; // Fallback number
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add some interactive effects
document.querySelectorAll('.video-placeholder').forEach(video => {
    video.addEventListener('click', () => {
        alert('Video player would open here. Integration with video hosting service needed.');
    });
});

document.querySelectorAll('.image-placeholder').forEach(image => {
    image.addEventListener('click', () => {
        alert('Image gallery would open here. Image hosting integration needed.');
    });
});
