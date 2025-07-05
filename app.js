const API_BASE_URL = 'https://smart-pdf-reader-backend.onrender.com'; // Replace with Render backend URL
let extractedText = '';

document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const pdfInput = document.getElementById('pdfInput');
    const uploadBtn = document.getElementById('uploadBtn');

    // Enable upload button when a file is selected
    pdfInput.addEventListener('change', () => {
        uploadBtn.disabled = !pdfInput.files[0];
    });

    // Drag and drop handling
    uploadArea.addEventListener('click', () => pdfInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('active');
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('active');
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('active');
        pdfInput.files = e.dataTransfer.files;
        uploadBtn.disabled = !pdfInput.files[0];
    });
});

async function uploadPDF() {
    const pdfInput = document.getElementById('pdfInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const status = document.getElementById('uploadStatus');
    const summary = document.getElementById('summary');

    if (!pdfInput.files[0]) {
        status.textContent = 'Please select a PDF file.';
        status.classList.add('error');
        status.classList.remove('success');
        return;
    }

    const formData = new FormData();
    formData.append('pdf', pdfInput.files[0]);

    uploadBtn.disabled = true;
    status.textContent = 'Uploading and processing PDF...';
    status.classList.remove('error', 'success');

    try {
        const response = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result.error) {
            throw new Error(result.error);
        }

        extractedText = result.text;
        summary.textContent = result.summary || 'No summary available.';
        status.textContent = 'PDF processed successfully!';
        status.classList.add('success');
        status.classList.remove('error');
        document.getElementById('questionBtn').disabled = false;
        pdfInput.value = ''; // Reset file input
    } catch (error) {
        console.error('Upload error:', error);
        status.textContent = `Error: ${error.message}`;
        status.classList.add('error');
        status.classList.remove('success');
    } finally {
        uploadBtn.disabled = !pdfInput.files[0];
    }
}

async function askQuestion() {
    const questionInput = document.getElementById('questionInput');
    const questionBtn = document.getElementById('questionBtn');
    const status = document.getElementById('qaStatus');
    const answer = document.getElementById('answer');
    const question = questionInput.value.trim();

    if (!question) {
        status.textContent = 'Please enter a question.';
        status.classList.add('error');
        status.classList.remove('success');
        return;
    }

    if (!extractedText) {
        status.textContent = 'Please upload a PDF first.';
        status.classList.add('error');
        status.classList.remove('success');
        return;
    }

    questionBtn.disabled = true;
    status.textContent = 'Fetching answer...';
    status.classList.remove('error', 'success');

    try {
        const response = await fetch(`${API_BASE_URL}/api/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, context: extractedText })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result.error) {
            throw new Error(result.error);
        }

        answer.textContent = result.answer || 'No answer available.';
        status.textContent = 'Question answered successfully!';
        status.classList.add('success');
        status.classList.remove('error');
        questionInput.value = '';
    } catch (error) {
        console.error('Question error:', error);
        status.textContent = `Error: ${error.message}`;
        status.classList.add('error');
        status.classList.remove('success');
    } finally {
        questionBtn.disabled = false;
    }
}