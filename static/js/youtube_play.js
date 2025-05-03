// Button to download MP3 and play it in audio player
document.getElementById("download-url-button").addEventListener("click", async () => {
    const url = document.getElementById("url-input").value;
    if (url) {
        try {
            const response = await fetch("/download_audio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({ video_url: url }),
            });

            if (!response.ok) {
                throw new Error("Failed to download audio");
            }

            // Handle the downloaded MP3 file and enable play and download
            const audioUrl = await response.blob(); // Assuming the server returns the audio file
            const audioObjectURL = URL.createObjectURL(audioUrl);
            const audioElement = document.getElementById("music");
            audioElement.src = audioObjectURL;
            document.getElementById("message-box").innerText = "Audio downloaded, ready to play.";

            // Show play and download buttons
            document.getElementById("play-button").style.display = "inline-block";
            document.getElementById("download-button").style.display = "inline-block";
        } catch (error) {
            console.error("Error downloading or playing the audio: ", error);
            document.getElementById("message-box").innerText = "Error downloading the audio.";
        }
    } else {
        document.getElementById("message-box").innerText = "Please enter a valid YouTube URL.";
    }
});

// Play the audio when play button is clicked
document.getElementById("play-button").addEventListener("click", () => {
    const audioElement = document.getElementById("music");
    audioElement.play();
});

// Download the audio when download button is clicked
document.getElementById("download-button").addEventListener("click", () => {
    const audioElement = document.getElementById("music");
    const audioUrl = audioElement.src;

    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = "downloaded-audio.mp3";
    a.click();
});