document.addEventListener('DOMContentLoaded', () => {
    if (typeof FFmpeg === 'undefined') {
        console.error('FFmpeg is not loaded. Check your <script> order.');
        return;
    }

    const { createFFmpeg, fetchFile } = FFmpeg;
    const ffmpeg = createFFmpeg({ log: true });

    const downloadBtn = document.getElementById('download-button');
    const fileInput = document.getElementById('audio-upload');
    const outputAudio = document.getElementById('output-audio');
    const audioContainer = document.getElementById('audio-container');

    if (!downloadBtn) {
        console.error('Download button not found in the DOM.');
        return;
    }

    if (!audioContainer) {
        console.error('Audio container not found.');
        return;
    }

    downloadBtn.addEventListener('click', async () => {
        try {
            if (!fileInput || fileInput.files.length === 0) {
                alert('Please upload a file first!');
                return;
            }

            const file = fileInput.files[0];
            const outputFileName = 'output.mp3';

            if (!ffmpeg.isLoaded()) {
                await ffmpeg.load();
            }

            ffmpeg.FS('writeFile', file.name, await fetchFile(file));
            await ffmpeg.run('-i', file.name, outputFileName);

            const data = ffmpeg.FS('readFile', outputFileName);
            const audioBlob = new Blob([data.buffer], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);

            if (outputAudio) {
                outputAudio.src = audioUrl;
            } else {
                const audio = document.createElement('audio');
                audio.id = 'output-audio';
                audio.controls = true;
                audio.src = audioUrl;
                audioContainer.appendChild(audio);
            }

            alert('Conversion complete! You can now play the audio.');
        } catch (error) {
            console.error('Error during conversion:', error);
            alert('An error occurred during the conversion. Please try again.');
        }
    });
});

