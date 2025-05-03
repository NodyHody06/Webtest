// Select elements
const body = document.body;
const result = document.getElementById('result');
const preview = document.getElementById('preview');

// Function to update the body overflow based on result/preview visibility
function updateBodyScroll() {
    if (result.style.display === 'block' || preview.style.display === 'block') {
        body.classList.add('scrollable');
    } else {
        body.classList.remove('scrollable');
    }
}

// Example of showing result or preview
function showResult() {
    result.style.display = 'block';
    updateBodyScroll();

    result.scrollIntoView({ behavior: 'smooth' });
}

function hideResult() {
    result.style.display = 'none';
    updateBodyScroll();
}

// Call updateBodyScroll when showing/hiding result or preview
document.getElementById('upload-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Simulate form submission and result display
    setTimeout(showResult, 1000); // Show result after a delay (simulate loading)
});
