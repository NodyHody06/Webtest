document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("music");
    const bars = document.querySelectorAll(".bars__item");
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const queueList = document.getElementById("audio-queue");
    const nextButton = document.getElementById("next");
    const prevButton = document.getElementById("prev");
    const queue = [];
    let currentTrackIndex = 0;


    analyser.fftSize = 64;
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    let source;
    let isPlaying = false;

    bars.forEach(bar => {
        bar.style.height = "0px";
        bar.style.transition = "height 0.5s ease-out";
    });

    // Play the current track (either file or YouTube)
    function playCurrentTrack() {
        if (queue.length === 0) return;

        const item = queue[currentTrackIndex];
        let fileURL;

        if (item.type === 'yt') {
            fileURL = item.url;
            audio.src = fileURL;
        }

        audio.play()
            .then(() => {
                document.getElementById("fileName").textContent = item.name;
                updateQueueUI();
            })
            .catch(error => {
                console.error("Error playing audio:", error);
            });
    }

    // Update the queue UI
    function updateQueueUI() {
        queueList.innerHTML = queue
            .map((item, index) => `
                <li data-index="${index}" ${index === currentTrackIndex ? 'class="playing"' : ""}>
                    ${item.name} <button class="remove-btn" data-remove-index="${index}">&times;</button>
                </li>
            `)
            .join("");

        document.querySelectorAll("#audio-queue li").forEach(item => {
            item.addEventListener("click", (event) => {
                if (!event.target.classList.contains("remove-btn")) {
                    currentTrackIndex = parseInt(event.target.getAttribute("data-index"));
                    playCurrentTrack();
                }
            });
        });

        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevent track click event
                const removeIndex = parseInt(event.target.getAttribute("data-remove-index"));
                removeFromQueue(removeIndex);
            });
        });
    }

    function removeFromQueue(index) {
        queue.splice(index, 1);

        // Adjust the currentTrackIndex if needed
        if (index === currentTrackIndex) {
            if (queue.length === 0) {
                audio.pause();
                audio.src = "";
                document.getElementById("fileName").textContent = "No file chosen";
                currentTrackIndex = 0;
            } else {
                currentTrackIndex = currentTrackIndex % queue.length;
                playCurrentTrack();
            }
        } else if (index < currentTrackIndex) {
            currentTrackIndex -= 1;
        }
        updateQueueUI();
    }

    // Next and Previous button events
    nextButton.addEventListener("click", () => {
        if (queue.length > 0) {
            currentTrackIndex = (currentTrackIndex + 1) % queue.length;
            playCurrentTrack();
        }
    });

    prevButton.addEventListener("click", () => {
        if (queue.length > 0) {
            currentTrackIndex = (currentTrackIndex - 1 + queue.length) % queue.length;
            playCurrentTrack();
        }
    });

    // Ensure proper handling of the audio ended event
    audio.addEventListener("ended", () => {
        isPlaying = false;
        currentTrackIndex = (currentTrackIndex + 1) % queue.length;
        playCurrentTrack();
    });

    // Ensuring audio plays properly by managing AudioContext state
    audio.addEventListener("play", () => {
        if (audioContext.state === "suspended") {
            audioContext.resume().then(() => {
                console.log('AudioContext resumed');
            });
        }

        if (!source) {
            source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
        }

        isPlaying = true;
        animateBars();
    });

    audio.addEventListener("pause", () => {
        isPlaying = false;
    });

    function animateBars() {
        analyser.getByteFrequencyData(frequencyData);

        bars.forEach((bar, index) => {
            if (isPlaying) {
                const dataIndex = Math.floor(index * frequencyData.length / bars.length);
                const barHeight = frequencyData[dataIndex] / 2;
                bar.style.height = `${barHeight}px`;
            } else {
                const currentHeight = parseFloat(bar.style.height);
                if (currentHeight > 0) {
                    bar.style.height = `${Math.max(0, currentHeight - 1)}px`;
                }
            }
        });

        requestAnimationFrame(animateBars);
    }

    animateBars();

    document.getElementById("download-yt-btn").addEventListener("click", async () => {
        const url = document.getElementById("yt-url").value;
        if (url) {
            try {
                const response = await fetch("/music/download_audio", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({ video_url: url }),
                });
    
                if (!response.ok) {
                    //throw new Error(`Failed to download audio. Status: ${response.status}`);
                    throw new Error('Failed to upload')
                }
    
                // Verify the content type to ensure it's an audio file
                const contentType = response.headers.get("Content-Type");
                if (contentType !== "audio/mpeg") {
                    throw new Error("Unexpected content type, not an audio file.");
                }
    
                const audioBlob = await response.blob();
                const audioObjectURL = URL.createObjectURL(audioBlob);
                
                // Add the YouTube track to the queue
                const videoTitle = url.split('/').pop() || "YouTube Track";
                queue.push({ type: 'yt', url: audioObjectURL, name: videoTitle });
    
                updateQueueUI();
    
                if (!isPlaying) {
                    currentTrackIndex = queue.length - 1;
                    playCurrentTrack();
                }
    
                document.getElementById("yt-message-box").innerText = "Audio downloaded, ready to play.";
               // document.getElementById("play-button").style.display = "inline-block";
                document.getElementById("download-button").style.display = "inline-block";
    
                document.getElementById("download-button").addEventListener("click", function () {
                    const link = document.createElement('a');
                    link.href = audioObjectURL;
                    link.download = "downloaded_audio.mp3";
                    link.click();
                });
    
            } catch (error) {
                console.error("Error downloading YouTube audio:", error);
                document.getElementById("yt-message-box").innerText = `Failed to download audio: ${error.message}`;
            }
        } else {
            document.getElementById("yt-message-box").innerText = "Please enter a YouTube URL.";
        }
    });    

    // Play button action
    //document.getElementById("play-button").addEventListener("click", function () {
     //   audio.play().catch(error => console.error("Error playing audio:", error));
    //});
});
