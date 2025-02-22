const socket = new WebSocket('ws://localhost:4051');

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('media-grid').addEventListener('submit', updateMedia);
})

// WS Listener: Update media when notified by backend
socket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        if (data.action === 'update' && data.camId) {
            refreshImages(data.camId);
        }
    }
    catch (error) {
        console.error('Error parsing JSON:', error);
    }
};

async function updateMedia() {
    event.preventDefault(); // prevent page reload
    // Get form data
    const form = document.getElementById('media-grid');
    const formData = new FormData();

    // Get file inputs from form
    const fileInputs = form.querySelectorAll('input[type="file"]');
    // Loop through file inputs and add to form data
    fileInputs.forEach(fileInput => {
        if (fileInput.files.length > 0) {
            formData.append(fileInput.id, fileInput.files[0]);
        }
    });

    try {
        // Send form data to server
        const response = await fetch('/upload-router', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            // Handle successful response
            refreshImages();
            console.log('File uploaded successfully');
        } else {
            // Handle error response
            console.log('Error uploading files:', error);
        }
    } catch (error) {
        // Handle error
        alert('Error uploading files:', error);
    }

    // Refresh images after upload
    /**
     * Refreshes the images in the given cam's viewer.
     * If camId is not provided, it refreshes all images.
     * @param {string} [camId] The id of the camera to refresh
     */
    function refreshImages(camId) {
        // Find the viewer element for the given camera
        const viewer = document.querySelector(`.cam-viewer[data-cam-id="${camId}"]`);
        if (!viewer) return;

        // Get the media type from the viewer's data attribute
        const mediaType = viewer.dataset.mediaType;
        // Create the correct element based on the media type
        const mediaElement = mediaType === 'video' ? 'video' : 'img';
        // Find the existing media element in the viewer
        const media = viewer.querySelector(mediaElement);

        // Construct the new src attribute for the media
        const newSrc = `/upload/${camId}.${mediaType === 'video' ? (mediaType === 'video' ? 'mp4' : 'mov') : mediaType === 'image' ? 'jpg' : 'png'}`;

        // If the media element already exists, update its src attribute
        if (media) {
            media.src = newSrc;
            // DEBUG:
            console.log('Existing media updated:', media);
        } else {
            // Otherwise create a new media element and append it to the viewer
            media = document.createElement(mediaElement);
            media.src = newSrc;
            // If it's a video element, add controls
            if (mediaElement === 'video') {
                media.controls = true;
            }
            viewer.appendChild(media);
            // DEBUG:
            console.log('New media added:', media);
        }
    }
}

