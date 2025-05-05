// Image preview with remove button
document.getElementById('file').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Create the preview container
            const previewContainer = document.createElement('div');
            previewContainer.className = 'preview-container';

            // Create the image element
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Uploaded Image Preview';

            // Create the remove button with SVG
            const removeButton = document.createElement('button');
            removeButton.className = 'remove-preview';
            removeButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="16px" height="16px">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M18.3 5.71a1 1 0 00-1.42 0L12 10.59 7.12 5.7a1 1 0 10-1.41 1.42L10.59 12l-4.88 4.88a1 1 0 001.41 1.41L12 13.41l4.88 4.88a1 1 0 001.41-1.41L13.41 12l4.88-4.88a1 1 0 000-1.41z"/>
                </svg>
            `;
            removeButton.addEventListener('click', function() {
                // Clear the file input and remove the preview
                document.getElementById('file').value = '';
                document.getElementById('uploaded-image').innerHTML = '';
                document.getElementById('preview').style.display = 'none';
            });

            // Append the image and remove button to the preview container
            previewContainer.appendChild(img);
            previewContainer.appendChild(removeButton);

            // Show the uploaded image
            const uploadedImageDiv = document.getElementById('uploaded-image');
            uploadedImageDiv.innerHTML = ''; // Clear any previous image
            uploadedImageDiv.appendChild(previewContainer);
            document.getElementById('preview').style.display = 'block'; // Show the preview box
        };
        reader.readAsDataURL(file);
    }
});

// Form submission and ASCII image generation
document.getElementById("upload-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Show loading spinner
    document.getElementById("loading").style.display = "block";

    const formData = new FormData(this);

    const response = await fetch("/upload", {
        method: "POST",
        body: formData
    });

    console.log('Response Status:', response.status);  // Log the HTTP status code
    console.log('Response OK:', response.ok);  // Log if response is ok

    // Hide loading spinner
    document.getElementById("loading").style.display = "none";

    if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const resultImage = document.getElementById("ascii-image");
        resultImage.src = url;

        // Show the output image box
        document.getElementById("result").style.display = 'block';

        // Show the download button 
        const downloadBtn = document.getElementById('download-btn');
        downloadBtn.style.display = 'block';

        // Set the download link to the generated Ascii image
        downloadBtn.onclick = () => {
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ascii-image.png';
            a.click();
        };

        // Show the "Remove Image" button
        const removeResultButton = document.getElementById('remove-result');
        removeResultButton.style.display = 'block';
    } else {
        const errorText = await response.text(); // Get the response body if there's an error
        console.error('Error details:', errorText);
        alert("Failed to generate ASCII image");
    }
});

// Remove the image when the "Remove Image" button is clicked
document.getElementById("remove-result").addEventListener("click", function() {
    // Clear the image source
    document.getElementById("ascii-image").src = "";

    // Hide the result section
    document.getElementById("result").style.display = "none";

    // Optionally, hide the download button
    document.getElementById("download-btn").style.display = "none";

    // Hide the remove button again
    document.getElementById("remove-result").style.display = "none";
});

