document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.querySelector('.btn-primary.large');

    if (startBtn) {
        startBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            // Zero-Disruption UI Capture: Using native prompts to maintain exact design structure
            const userRole = prompt("Enter your target role (e.g., Software Engineer):", "Software Engineer");
            if (!userRole) return; // Cancelled

            const interviewType = prompt("Enter interview type (e.g., Technical, Behavioral):", "Technical");
            if (!interviewType) return; // Cancelled

            const payload = {
                role: userRole,
                type: interviewType
            };

            console.log("[Pipeline] Triggering /start API with payload:", payload);

            try {
                // BLANK API CALL AS REQUESTED
                // We attempt the fetch, but since the backend is handled by other members,
                // we intercept failures gracefully to keep the pipeline flow complete for showcase.
                const response = await fetch('/start', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                let data;
                if (response.ok) {
                    data = await response.json();
                } else {
                    throw new Error('Backend not yet implemented.');
                }

                // Store standard session flow elements
                localStorage.setItem('session_id', data.session_id);
                localStorage.setItem('first_question', data.first_question);

                console.log("[Pipeline] Backend successful. Routing to interview.html");
                window.location.href = 'interview.html';

            } catch (error) {
                console.warn("[Pipeline] Backend unavailable. Mocking pipeline flow for frontend showcase:", error.message);

                // Mock fallback to ensure frontend pipeline showcase functions without backend
                const mockSessionId = "session_" + Math.random().toString(36).substr(2, 9);
                const mockQuestion = "Can you explain the difference between REST and GraphQL?";

                localStorage.setItem('session_id', mockSessionId);
                localStorage.setItem('first_question', mockQuestion);
                localStorage.setItem('user_role', userRole);
                localStorage.setItem('interview_type', interviewType);

                console.log(`[Pipeline] Session stored: ${mockSessionId}. Routing to interview.`);
                window.location.href = 'interview.html';
            }
        });
    }
});
