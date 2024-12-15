// Initialize Gemini API (Replace with your actual API key)
const API_KEY = "AIzaSyALEJAaP0zuNc7plgCi5Gudqdk_b4CMR8c";

// Check if the user is logged in
window.onload = function() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        window.location.href = "login.html"; // Redirect to login page if not logged in
    }
};

// Form Elements
const form = document.getElementById("resumeForm");
const generateSummaryBtn = document.getElementById("generateSummary");
const addExperienceBtn = document.getElementById("addExperience");
const addEducationBtn = document.getElementById("addEducation");
const generateResumeBtn = document.getElementById("generateResume");
const downloadPdfBtn = document.getElementById("downloadPdf");
const profileImageInput = document.getElementById("profileImage");
const profileImagePreview = document.getElementById("profileImagePreview");

const logoutBtn = document.createElement("button");
logoutBtn.textContent = "Logout";
logoutBtn.type = "button";
logoutBtn.id = "logoutBtn";
logoutBtn.className = "btn secondary-btn";

// Append the logout button to the form or any other suitable element
document.querySelector(".form-section").appendChild(logoutBtn);

// Logout functionality
logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
});


// Preview Elements
const previewContent = document.getElementById("previewContent");
const startBuildingBtn = document.getElementById("startBuilding");
const formSection = document.getElementById("formSection");
const previewSection = document.getElementById("previewSection");

// Initially hide form and preview sections
formSection.style.display = "none";
previewSection.style.display = "none";

// Show form and preview sections on "Start Building" button click
startBuildingBtn.addEventListener("click", () => {
    formSection.style.display = "block";
    previewSection.style.display = "block";
    startBuildingBtn.style.display = "none"; // Hide the button after click
});

// Handle profile image upload and preview
profileImageInput.addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profileImagePreview.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// --- Event Listeners ---

// Generate Summary with Gemini
generateSummaryBtn.addEventListener("click", async () => {
    const name = document.getElementById("name").value;
    const experiences = getExperiences(); // Function defined below
    const educations = getEducations();   // Function defined below
    const skills = document.getElementById("skills").value;

    const prompt = `Write a professional resume summary for ${name} based on the following information:
        - Work Experience: ${JSON.stringify(experiences)}
        - Education: ${JSON.stringify(educations)}
        - Skills: ${skills}`;

    const summary = await generateWithGemini(prompt);
    document.getElementById("summary").value = summary;
});

// Add Experience Section
addExperienceBtn.addEventListener("click", () => {
    addSection("experiences", ["Job Title", "Company", "Start Date", "End Date", "Description"]);
});

// Add Education Section
addEducationBtn.addEventListener("click", () => {
    addSection("educations", ["Degree", "Institution", "Start Date", "End Date"]);
});

// Generate Resume Preview
generateResumeBtn.addEventListener("click", () => {
    generatePreview();
    document.getElementById("resumePreview").style.display = "block";
    downloadPdfBtn.disabled = false;
});

// Download PDF (using jsPDF and html2canvas)
downloadPdfBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    
    // Define custom font
    const customFont = "Times New Roman";

    html2canvas(document.getElementById("resumePreview"), { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const aspectRatio = canvas.width / canvas.height;
        let imgWidth = pdfWidth;
        let imgHeight = pdfWidth / aspectRatio;

        if (imgHeight > pdfHeight) {
            imgHeight = pdfHeight;
            imgWidth = pdfHeight * aspectRatio;
        }

        const offsetX = (pdfWidth - imgWidth) / 2;
        const offsetY = (pdfHeight - imgHeight) / 2;

        pdf.addImage(imgData, 'JPEG', offsetX, offsetY, imgWidth, imgHeight, null, 'FAST');
        pdf.save("resume.pdf");
    });
});

// --- Helper Functions ---

// Function to make API calls to Gemini
async function generateWithGemini(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt,
                }]
            }]
        }),
    });

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
    } else {
        console.error("Error generating content:", data);
        return "Error generating summary.";
    }
}

// Function to add a section dynamically (e.g., experience, education)
function addSection(sectionId, fields) {
    const section = document.getElementById(sectionId);
    const div = document.createElement("div");
    div.className = "input-group";

    fields.forEach(field => {
        const label = document.createElement("label");
        label.textContent = field;
        label.htmlFor = `${sectionId}-${field.toLowerCase().replace(/\s/g, "")}-${section.children.length}`;

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = `Enter ${field}`;
        input.id = `${sectionId}-${field.toLowerCase().replace(/\s/g, "")}-${section.children.length}`;

        div.appendChild(label);
        div.appendChild(input);
    });

    section.appendChild(div);
}

// Function to get experience data from the form
function getExperiences() {
    const experiences = [];
    const experienceSections = document.querySelectorAll("#experiences > div");
    experienceSections.forEach(section => {
        experiences.push({
            jobTitle: section.querySelector('[id^="experiences-jobtitle"]').value,
            company: section.querySelector('[id^="experiences-company"]').value,
            startDate: section.querySelector('[id^="experiences-startdate"]').value,
            endDate: section.querySelector('[id^="experiences-enddate"]').value,
            description: section.querySelector('[id^="experiences-description"]').value,
        });
    });
    return experiences;
}

// Function to get education data from the form
function getEducations() {
    const educations = [];
    const educationSections = document.querySelectorAll("#educations > div");
    educationSections.forEach(section => {
        educations.push({
            degree: section.querySelector('[id^="educations-degree"]').value,
            institution: section.querySelector('[id^="educations-institution"]').value,
            startDate: section.querySelector('[id^="educations-startdate"]').value,
            endDate: section.querySelector('[id^="educations-enddate"]').value,
        });
    });
    return educations;
}

// Function to generate the HTML for the preview
function generatePreview() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const linkedin = document.getElementById("linkedin").value;
    const github = document.getElementById("github").value;
    const summary = document.getElementById("summary").value;
    const experiences = getExperiences();
    const educations = getEducations();
    const skills = document.getElementById("skills").value.split(",");
    const profileImage = profileImagePreview.src;

    let previewHTML = `<div class="profile-image"><img src="${profileImage}" alt="Profile Image"></div>`;
    previewHTML += `<h2>${name}</h2>`;
    previewHTML += `<p>${email} | ${phone}</p>`;
    if (linkedin) previewHTML += `<p>LinkedIn: <a href="${linkedin}" target="_blank">${linkedin}</a></p>`;
    if (github) previewHTML += `<p>GitHub: <a href="${github}" target="_blank">${github}</a></p>`;

    previewHTML += `<h3>Summary</h3><p>${summary}</p>`;

    previewHTML += `<h3>Work Experience</h3>`;
    experiences.forEach(exp => {
        previewHTML += `<h4>${exp.jobTitle} at ${exp.company}</h4>`;
        previewHTML += `<p>${exp.startDate} - ${exp.endDate}</p>`;
        previewHTML += `<p>${exp.description}</p>`;
    });

    previewHTML += `<h3>Education</h3>`;
    educations.forEach(edu => {
        previewHTML += `<h4>${edu.degree} from ${edu.institution}</h4>`;
        previewHTML += `<p>${edu.startDate} - ${edu.endDate}</p>`;
    });

    previewHTML += `<h3>Skills</h3>`;
    previewHTML += `<ul>${skills.map(skill => `<li>${skill.trim()}</li>`).join('')}</ul>`;

    previewContent.innerHTML = previewHTML;
}

