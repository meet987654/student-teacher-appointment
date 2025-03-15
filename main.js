// scripts/main.js
// Firebase Authentication
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Logged in as:", user.email);
      // Redirect to dashboard based on user role
      if (user.email === "admin@example.com") {
        window.location.href = "admin.html";
      } else if (user.email.includes("teacher")) {
        window.location.href = "teacher.html";
      } else {
        window.location.href = "student.html";
      }
    })
    .catch((error) => {
      console.error("Login Error:", error.message);
    });
}

function register() {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Registered as:", user.email);
    })
    .catch((error) => {
      console.error("Registration Error:", error.message);
    });
}

// Admin Functions
function addTeacher() {
  const name = document.getElementById('teacher-name').value;
  const department = document.getElementById('teacher-department').value;
  const subject = document.getElementById('teacher-subject').value;

  db.collection('teachers').add({
    name: name,
    department: department,
    subject: subject
  })
  .then(() => {
    console.log("Teacher added successfully!");
    loadTeachers();
  })
  .catch((error) => {
    console.error("Error adding teacher:", error);
  });
}

function loadTeachers() {
  const teachersList = document.getElementById('teachers-list');
  teachersList.innerHTML = "";

  db.collection('teachers').get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const teacher = doc.data();
        const li = document.createElement('li');
        li.textContent = `${teacher.name} - ${teacher.department} (${teacher.subject})`;
        teachersList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error loading teachers:", error);
    });
}

// Teacher Functions
function scheduleAppointment() {
  const time = document.getElementById('appointment-time').value;

  db.collection('appointments').add({
    teacherId: auth.currentUser.uid,
    time: time,
    status: "Scheduled"
  })
  .then(() => {
    console.log("Appointment scheduled successfully!");
    loadAppointments();
  })
  .catch((error) => {
    console.error("Error scheduling appointment:", error);
  });
}

function loadAppointments() {
  const appointmentsList = document.getElementById('appointments-list');
  appointmentsList.innerHTML = "";

  db.collection('appointments')
    .where("teacherId", "==", auth.currentUser.uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const appointment = doc.data();
        const li = document.createElement('li');
        li.textContent = `${appointment.time} - ${appointment.status}`;
        appointmentsList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error loading appointments:", error);
    });
}

// Student Functions
function searchTeacher() {
  const searchTerm = document.getElementById('search-teacher').value;

  db.collection('teachers')
    .where("name", "==", searchTerm)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const teacher = doc.data();
        alert(`Teacher Found: ${teacher.name} - ${teacher.department}`);
      });
    })
    .catch((error) => {
      console.error("Error searching teacher:", error);
    });
}

function bookAppointment() {
  const teacherId = document.getElementById('teacher-id').value;
  const time = document.getElementById('appointment-time').value;

  db.collection('appointments').add({
    teacherId: teacherId,
    studentId: auth.currentUser.uid,
    time: time,
    status: "Pending"
  })
  .then(() => {
    console.log("Appointment booked successfully!");
  })
  .catch((error) => {
    console.error("Error booking appointment:", error);
  });
}
