const API_BASE_URL = 'https://your-render-backend-url'; // Replace with Render backend URL
let extractedText = '';

async function uploadPDF() {
    const fileInput = document.getElementById('pdfInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const status = document.getElementById('uploadStatus');
    const summary = document.getElementById('summary');

    if (!fileInput.files[0]) {
        status.textContent = 'Please select a PDF file.';
        status.classList.add('error');
        return;
    }

    const formData = new FormData();
    formData.append('pdf', fileInput.files[0]);
    
    uploadBtn.disabled = true;
    status.textContent = 'Uploading and processing...';
    status.classList.remove('error');

    try {
        const response = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Failed to process PDF');

        const result = await response.json();
        extractedText = result.text;
        summary.textContent = result.summary || 'No summary available.';
        status.textContent = 'PDF processed successfully!';
    } catch (error) {
        console.error('Error:', error);
        status.textContent = 'Error processing PDF. Please try again.';
        status.classList.add('error');
    } finally {
        uploadBtn.disabled = false;
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
        return;
    }

    if (!extractedText) {
        status.textContent = 'Please upload a PDF first.';
        status.classList.add('error');
        return;
    }

    questionBtn.disabled = true;
    status.textContent = 'Fetching answer...';
    status.classList.remove('error');

    try {
        const response = await fetch(`${API_BASE_URL}/api/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, context: extractedText })
        });

        if (!response.ok) throw new Error('Failed to get answer');

        const result = await response.json();
        answer.textContent = result.answer || 'No answer available.';
        status.textContent = 'Question answered successfully!';
        questionInput.value = '';
    } catch (error) {
        console.error('Error:', error);
        status.textContent = 'Error fetching answer. Please try again.';
        status.classList.add('error');
    } finally {
        questionBtn.disabled = false;
    }
}