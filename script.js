// ===== College Chatbot Script (Final Updated & Fixed Matching) =====

// UI element references
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotContainer = document.getElementById("chatbot-container");
const minimizeBtn = document.getElementById("minimize-btn");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const messagesContainer = document.getElementById("chatbot-messages");

// Toggle chatbot visibility
chatbotToggle.onclick = () => chatbotContainer.classList.toggle("hidden");
minimizeBtn.onclick = () => chatbotContainer.classList.add("hidden");

// Add message to chat
function addMessage(text, sender, options = []) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.textContent = text;

  msgDiv.appendChild(bubble);
  messagesContainer.appendChild(msgDiv);

  // Add clickable suggestion buttons
  if (options.length > 0) {
    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.classList.add("option-btn");
      btn.textContent = opt;
      btn.onclick = () => handleSend(opt);
      optionsDiv.appendChild(btn);
    });
    messagesContainer.appendChild(optionsDiv);
  }

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Handle sending a message
function handleSend(text = userInput.value) {
  if (!text.trim()) return;

  addMessage(text, "user");
  userInput.value = "";

  setTimeout(() => {
    const match = findBestMatch(text);
    addMessage(match.response, "bot", match.options);
  }, 600);
}

// Send button and Enter key support
sendBtn.onclick = () => handleSend();
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSend();
});

// ===== Knowledge Base =====
const knowledgeBase = {
  greetings: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"],

  admissions: {
    keywords: ["admission", "admissions", "apply", "application", "join", "enroll", "entrance"],
    response: `🎓 Admissions for 2025 are open through KCET, COMED-K & Management Quota.
Eligibility: 10+2 (PCM) with 45%.
Documents required: 10th & 12th marksheets, KCET/COMED-K, TC, etc.
👉 Visit: https://www.citcoorg.edu.in/admissions`,
    options: ["Courses", "Fee Structure", "Contact Info"],
  },

  courses: {
    keywords: ["course", "courses", "branch", "department", "engineering", "degree", "cse", "aiml", "aids", "cyber", "ece", "mechanical", "civil"],
    response: `📚 CIT offers the following programs:
• CSE, AI & ML, AI & DS, Cyber Security, Computer Science
• ECE, Mechanical, Civil
Affiliated to VTU. Duration: 4 years (B.E.)`,
    options: ["Admissions", "Facilities", "Placements"],
  },

  contact: {
    keywords: ["contact", "phone", "email", "address", "location"],
    response: `📍 Coorg Institute of Technology, Ponnampet, Kodagu
📞 08274-256216 | 📱 +91-9480756216
📧 info@citcoorg.edu.in
🌐 https://www.citcoorg.edu.in`,
    options: ["Get Directions", "Admissions", "Courses"],
  },

  placements: {
    keywords: ["placement", "placements", "job", "recruit", "company", "career"],
    response: `💼 CIT's Training & Placement Cell offers:
✅ Aptitude & Soft Skills Training
✅ Industry Internships
✅ Top Recruiters: Infosys, Wipro, TCS, Accenture
Placement Rate: 95% 🎯`,
    options: ["Training Details", "Courses", "Contact Info"],
  },

  facilities: {
    keywords: ["facility", "facilities", "lab", "library", "hostel", "campus", "wifi", "sports"],
    response: `🏛️ Campus Facilities:
🖥️ Modern Labs for all branches
📚 Library with 15,000+ books
🏠 Separate Hostels (Wi-Fi, mess)
⚽ Sports Complex & Gym
🚌 College buses on all major routes`,
    options: ["Hostel Info", "Admissions", "Placements"],
  },

  faculty: {
    keywords: ["faculty", "teacher", "professor", "lecturer", "staff"],
    response: `👩‍🏫 Our faculty are highly qualified, many with PhDs and rich teaching experience.
They focus on academic excellence and student mentoring.`,
    options: ["Courses", "Admissions", "Contact Info"],
  },

  fees: {
    keywords: ["fee", "fees", "fee structure", "tuition", "payment", "cost", "scholarship"],
    response: `💰 **Fee Structure:**
- Govt Quota (KCET): ₹50,000 - ₹70,000 / year
- COMED-K: ₹80,000 - ₹1,20,000 / year
- Management Quota: varies by branch
🏠 Hostel: ₹60,000 - ₹80,000 / year
🚌 Transport: ₹15,000 - ₹25,000 / year
🎓 Scholarships available for eligible students.`,
    options: ["Scholarship Info", "Admissions", "Contact Info"],
  },

  // ✅ Scholarship Section — fully working
  scholarship: {
    keywords: ["scholarship", "scholarships", "scholarship info", "fund", "financial aid", "scholarship details"],
    response: `🎓 CIT supports various government & private scholarships.
✅ SC/ST/OBC scholarships
✅ Minority scholarships
✅ Defense and merit-based scholarships
Apply via official government portals.`,
    options: ["Fee Structure", "Admissions", "Contact Info"],
  },

  // ✅ Hostel Section — fully working
  hostel: {
    keywords: ["hostel", "accommodation", "room", "mess", "residence", "hostel info", "hostel details"],
    response: `🏠 **Hostel Facilities:**
- Separate hostels for boys & girls
- 24/7 security & Wi-Fi
- Hygienic mess (veg & non-veg)
- Study rooms & recreation areas
- Annual hostel fee: ₹60,000 - ₹80,000`,
    options: ["Facilities", "Fee Structure", "Contact Info"],
  },

  training: {
    keywords: ["training", "internship", "mock", "skill", "aptitude", "resume", "interview"],
    response: `📘 Training & Skill Development:
- Aptitude & Reasoning sessions
- Technical interview practice
- Mock interviews & group discussions
- Resume building workshops
- Communication & soft skills`,
    options: ["Placements", "Courses", "Contact Info"],
  },
};

// ===== Improved Matching Logic =====
function findBestMatch(input) {
  const lower = input.toLowerCase().trim();

  // Check greetings first
  if (knowledgeBase.greetings.some((g) => lower.includes(g))) {
    return {
      response:
        "Hello! 👋 How can I assist you today?\nAsk about Admissions, Courses, Facilities, Faculty, Placements, or Fees.",
      options: [
        "Admissions",
        "Courses",
        "Facilities",
        "Faculty",
        "Placements",
        "Fee Structure",
      ],
    };
  }

  // Match against all categories with flexible matching
  for (const [key, data] of Object.entries(knowledgeBase)) {
    if (
      data.keywords &&
      data.keywords.some((k) => lower.includes(k.toLowerCase().replace(/info|details/g, "").trim()))
    ) {
      return data;
    }
  }

  // Default fallback
  return {
    response: `🤖 I'm not sure about that. Try asking about:
📚 Courses • 📝 Admissions • 💼 Placements • 🏛️ Facilities • 👩‍🏫 Faculty • 💰 Fees`,
    options: ["Courses", "Admissions", "Facilities", "Placements", "Fee Structure"],
  };
}

// ===== Initial Greeting =====
addMessage("Welcome to CIT Assistant! 😊\nHow can I help you today?", "bot", [
  "Admissions",
  "Courses",
  "Contact Info",
  "Facilities",
  "Placements",
  "Faculty",
  "Fee Structure",
]);
