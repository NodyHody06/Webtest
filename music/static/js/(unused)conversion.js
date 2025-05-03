document.addEventListener("DOMContentLoaded", function () {
    const youtubeUrlInput = document.getElementById("yt-url");

    if(!youtubeUrlInput){
        console.error("The 'youtube-url' input field is missing.");
        return;
    }

    // Event listener for the YouTube URL input
    youtubeUrlInput.addEventListener("change", async () => {
        const url = youtubeUrlInput.value;

        if(!url){
            alert("Please enter a valid Youtube URL");
            return;
        }
        
        try{
            const response = await fetch('/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            if (response.ok) {
                const result = await response.json(); // Expecting JSON response
                // Handle the success response (e.g., play the audio)
                console.log('Audio URL:', result.url);
                console.log('Image URL:', result.image);
            } else {
                console.error('Error:', response.statusText);
                alert("There was an issue downloading the audio");
            }
        } catch (error){
            console.error('Error during fetch :', error);
            alert("An error occured during the request.");
        }
    });
});
