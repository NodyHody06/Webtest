const body = document.getElementById(body);

const height = document.querySelector("#background");

// Initialize resize observer object
let resizeObserver = new ResizeObserver(() => {
            
    // Set the current height and width
    // to the element
    height.innerHTML = window.innerHeight;
    width.innerHTML = window.innerWidth;

});

// Add a listener to body
resizeObserver.observe(body);