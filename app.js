const uploadForm = document.getElementById("uploadForm");
const pdfFile = document.getElementById("pdfFile");
const summaryText = document.getElementById("summaryText");
const questionInput = document.getElementById("questionInput");
const askBtn = document.getElementById("askBtn");
const answerText = document.getElementById("answerText");
const relatedList = document.getElementById("relatedList");

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = pdfFile.files[0];
  const formData = new FormData();
  formData.append("pdf", file);

  const res = await fetch("https://smart-pdf-reader-backend.vercel.app/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  summaryText.textContent = data.summary;
  document.getElementById("summarySection").classList.remove("hidden");
  document.getElementById("qaSection").classList.remove("hidden");
  document.getElementById("relatedSection").classList.remove("hidden");

  // Populate related content
  relatedList.innerHTML = "";
  data.related.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    relatedList.appendChild(li);
  });
});

askBtn.addEventListener("click", async () => {
  const question = questionInput.value;
  const res = await fetch("https://smart-pdf-reader-backend.vercel.app/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  const data = await res.json();
  answerText.textContent = data.answer;
});
