// smart-pdf-reader/frontend/app.js

const uploadForm = document.getElementById("uploadForm");
const pdfFile = document.getElementById("pdfFile");
const summaryText = document.getElementById("summaryText");
const questionInput = document.getElementById("questionInput");
const askBtn = document.getElementById("askBtn");
const answerText = document.getElementById("answerText");
const relatedList = document.getElementById("relatedList");

// ✅ BACKEND BASE URL — update only here if needed
const BACKEND_BASE_URL = "https://smart-pdf-reader-backend.vercel.app/api";

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = pdfFile.files[0];
  if (!file) {
    alert("Please select a PDF file.");
    return;
  }

  const formData = new FormData();
  formData.append("pdf", file);

  try {
    const res = await fetch(`${BACKEND_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();

    // ✅ Show summary
    summaryText.textContent = data.summary;
    document.getElementById("summarySection").classList.remove("hidden");
    document.getElementById("qaSection").classList.remove("hidden");
    document.getElementById("relatedSection").classList.remove("hidden");

    // ✅ Show related content
    relatedList.innerHTML = "";
    data.related.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      relatedList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert("Failed to upload PDF. Please try again.");
  }
});

askBtn.addEventListener("click", async () => {
  const question = questionInput.value.trim();
  if (!question) {
    alert("Please enter a question.");
    return;
  }

  try {
    const res = await fetch(`${BACKEND_BASE_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (!res.ok) throw new Error("Question failed");

    const data = await res.json();
    answerText.textContent = data.answer;
  } catch (err) {
    console.error(err);
    alert("Failed to get answer. Please try again.");
  }
});
