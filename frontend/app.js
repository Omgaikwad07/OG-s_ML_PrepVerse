document.addEventListener('DOMContentLoaded', () => {

    const path = window.location.pathname;

    /* =========================
       1. INDEX PAGE LOGIC
       ========================= */
    if (path.includes("index.html") || path === "/") {

        const startBtn = document.getElementById("startInterviewBtn");

        if (startBtn) {
            startBtn.addEventListener("click", () => {
                console.log("[Navigation] Moving to select.html");
                window.location.href = "select.html";
            });
        }
    }

    /* =========================
       2. SELECT PAGE LOGIC
       ========================= */
    if (path.includes("select.html")) {

        const startBtn = document.querySelector(".btn-primary");
        const skillInput = document.getElementById("skillInput");
        const skillsBox = document.getElementById("skillsBox");

        let skills = [];

        // ======================
        // SKILLS INPUT
        // ======================
        if (skillInput) {
            skillInput.addEventListener("keypress", function (e) {
                if (e.key === "Enter") {
                    e.preventDefault();
                    const value = skillInput.value.trim();

                    if (value) {
                        skills.push(value);

                        const tag = document.createElement("span");
                        tag.className = "skill-tag";
                        tag.innerText = value;

                        skillsBox.appendChild(tag);
                        skillInput.value = "";
                    }
                }
            });
        }

        // ======================
        // START INTERVIEW
        // ======================
        if (startBtn) {
            startBtn.addEventListener('click', async (e) => {
                e.preventDefault();

                // 🔥 GET FORM VALUES
                const category = document.getElementById("category").value;
                const role = document.getElementById("role").value;
                const experience = document.getElementById("experience").value;
                const company = document.getElementById("company").value.trim();
                const resumeFile = document.getElementById("resume").files[0];

                // VALIDATION
                if (!category || !role || !experience || !company || !resumeFile || skills.length === 0) {
                    alert("Please fill all fields!");
                    return;
                }

                try {

                    // ======================
                    // 📄 SEND RESUME → PYTHON
                    // ======================
                    const formData = new FormData();
                    formData.append("file", resumeFile);

                    const res = await fetch("http://127.0.0.1:8000/upload-resume", {
                        method: "POST",
                        body: formData
                    });

                    const resumeData = await res.json();

                    console.log("[Resume Parsed]:", resumeData);

                    // ======================
                    // 🧠 FINAL CONFIG JSON
                    // ======================
                    const finalConfig = {
                        category,
                        role,
                        experience,
                        company,
                        manual_skills: skills,
                        resume_data: resumeData.data,
                        timestamp: new Date().toISOString()
                    };

                    console.log("[Final Config]:", finalConfig);

                    // STORE
                    localStorage.setItem("interview_config", JSON.stringify(finalConfig));

                    // ======================
                    // 🔥 CATEGORY ROUTING
                    // ======================
                    if (category === "Technical" || category === "System Design") {
                        window.location.href = "technical.html";
                    } else if (category === "HR Round" || category === "Behavioral") {
                        window.location.href = "hr.html";
                    } else {
                        window.location.href = "interview.html";
                    }

                } catch (error) {

                    console.warn("[Fallback Mode] Python backend not running");

                    // MOCK DATA
                    const mockSessionId = "session_" + Math.random().toString(36).substr(2, 9);
                    const mockQuestion = "Explain difference between REST and GraphQL";

                    localStorage.setItem('session_id', mockSessionId);
                    localStorage.setItem('first_question', mockQuestion);
                    localStorage.setItem('user_role', role);
                    localStorage.setItem('interview_type', category);

                    window.location.href = 'interview.html';
                }
            });
        }
    }

});