let extractedText = '';
let isSpeaking = false;
let currentUtterance = null;

document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const pdfInput = document.getElementById('pdfInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const progressCircle = document.getElementById('progressCircle');
    const summaryText = document.getElementById('summaryText');
    const answerText = document.getElementById('answerText');
    const speakSummaryBtn = document.getElementById('speakSummaryBtn');
    const speakAnswerBtn = document.getElementById('speakAnswerBtn');

    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        header.classList.toggle('sticky', window.scrollY > 0);
    });

    pdfInput.addEventListener('change', () => {
        uploadBtn.disabled = !pdfInput.files[0];
        const status = document.getElementById('uploadStatus');
        status.textContent = pdfInput.files[0] ? `Selected: ${pdfInput.files[0].name}` : '';
        status.classList.remove('error', 'success');
        speakSummaryBtn.disabled = true;
    });

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
        const status = document.getElementById('uploadStatus');
        status.textContent = pdfInput.files[0] ? `Selected: ${pdfInput.files[0].name}` : '';
        status.classList.remove('error', 'success');
        speakSummaryBtn.disabled = true;
    });

    function simulateProgress() {
        progressCircle.classList.add('active');
        setTimeout(() => {
            progressCircle.classList.remove('active');
        }, 2000);
    }

    function speakText(text, button) {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
            button.innerHTML = '<i class="fas fa-volume-up" aria-hidden="true"></i>';
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const indianVoice = voices.find(voice => voice.lang === 'en-IN') || voices.find(voice => voice.lang === 'en-US');
        utterance.voice = indianVoice;
        utterance.lang = indianVoice ? indianVoice.lang : 'en-IN';
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 1;

        utterance.onend = () => {
            isSpeaking = false;
            button.innerHTML = '<i class="fas fa-volume-up" aria-hidden="true"></i>';
        };

        window.speechSynthesis.speak(utterance);
        isSpeaking = true;
        currentUtterance = utterance;
        button.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i>';
    }

    window.speechSynthesis.onvoiceschanged = () => {
        // Ensure voices are loaded
    };

    speakSummaryBtn.addEventListener('click', () => {
        const text = summaryText.textContent.trim();
        if (text && text !== 'Upload a PDF to see its summary.') {
            speakText(text, speakSummaryBtn);
        }
    });

    speakAnswerBtn.addEventListener('click', () => {
        const text = answerText.textContent.trim();
        if (text && text !== 'Answers will appear here.') {
            speakText(text, speakAnswerBtn);
        }
    });

    window.simulateProgress = simulateProgress;
});

async function uploadPDF() {
    const pdfInput = document.getElementById('pdfInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const status = document.getElementById('uploadStatus');
    const summaryText = document.getElementById('summaryText');
    const speakSummaryBtn = document.getElementById('speakSummaryBtn');

    if (!pdfInput.files[0]) {
        status.textContent = 'Please select a PDF file.';
        status.classList.add('error');
        status.classList.remove('success');
        return;
    }

    if (pdfInput.files[0].size > 10 * 1024 * 1024) {
        status.textContent = 'File size exceeds 10MB limit.';
        status.classList.add('error');
        status.classList.remove('success');
        return;
    }

    const formData = new FormData();
    formData.append('pdf', pdfInput.files[0]);

    uploadBtn.disabled = true;
    status.textContent = 'Uploading and processing PDF...';
    status.classList.remove('error', 'success');
    summaryText.classList.remove('slide-in');
    window.simulateProgress();

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || `HTTP error! Status: ${response.status}`);
        }

        extractedText = result.text;
        summaryText.textContent = result.summary || 'No summary available.';
        summaryText.classList.add('slide-in');
        status.textContent = 'PDF processed successfully!';
        status.classList.add('success');
        status.classList.remove('error');
        document.getElementById('questionBtn').disabled = false;
        speakSummaryBtn.disabled = false;
        pdfInput.value = '';
        uploadBtn.disabled = true;
    } catch (error) {
        console.error('Upload error:', error);
        status.textContent = `Error: ${error.message}`;
        status.classList.add('error');
        status.classList.remove('success');
        speakSummaryBtn.disabled = true;
    } finally {
        uploadBtn.disabled = !pdfInput.files[0];
    }
}

async function askQuestion() {
    const questionInput = document.getElementById('questionInput');
    const questionBtn = document.getElementById('questionBtn');
    const status = document.getElementById('qaStatus');
    const answerText = document.getElementById('answerText');
    const speakAnswerBtn = document.getElementById('speakAnswerBtn');
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
    answerText.classList.remove('slide-in');

    try {
        const response = await fetch('/api/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, context: extractedText }),
            credentials: 'include'
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || `HTTP error! Status: ${response.status}`);
        }

        answerText.textContent = result.answer || 'No answer available.';
        answerText.classList.add('slide-in');
        status.textContent = 'Question answered successfully!';
        status.classList.add('success');
        status.classList.remove('error');
        speakAnswerBtn.disabled = false;
        questionInput.value = '';
    } catch (error) {
        console.error('Question error:', error);
        status.textContent = `Error: ${error.message}`;
        status.classList.add('error');
        status.classList.remove('success');
        speakAnswerBtn.disabled = true;
    } finally {
        questionBtn.disabled = false;
    }
}