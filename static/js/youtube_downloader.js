// static/js/youtube_downloader.js
document.addEventListener('DOMContentLoaded', function() {
    const downloadButton = document.getElementById('download-button');
    const urlInput = document.getElementById('url-input');
    const messageBox = document.getElementById('message-box');

    downloadButton.addEventListener('click', async () => {
        const videoUrl = urlInput.value;
        
        if (!videoUrl) {
            messageBox.textContent = 'Please enter a URL.';
            return;
        }

        messageBox.textContent = 'Downloading...';

        try {
            const response = await fetch('/download_audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ video_url: videoUrl })
            });

            if (response.ok) {
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `${videoUrl}.mp3`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                messageBox.textContent = 'Download complete!';
            } else {
                messageBox.textContent = 'Failed to download. Please try again.';
            }
        } catch (error) {
            messageBox.textContent = 'An error occurred.';
            console.error(error);
        }
    });
});
