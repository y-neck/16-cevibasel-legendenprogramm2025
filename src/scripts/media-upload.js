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
    const uploadedFileIds = []; // Keep track of uploaded file ids
    // Loop through file inputs and add to form data
    fileInputs.forEach(fileInput => {
        if (fileInput.files.length > 0) {
            formData.append(fileInput.id, fileInput.files[0]);
            const camId = fileInput.dataset.camId;  // Get camId from file input
            uploadedFileIds.push(camId); // Add file id to uploaded file ids
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
            uploadedFileIds.forEach(camId => {
                // Broadcast update to all clients
                socket.send(JSON.stringify({
                    action: 'update',
                    camId: camId
                }));
                refreshImages(camId);
                console.log('File uploaded successfully');
            });
        } else {
            // Handle error response
            const errorMsg = await response.text();
            console.log('Error uploading files:', errorMsg);
        }
    } catch (error) {
        // Handle error
        console.log('Error uploading files:', error);
    }

    // Refresh images after upload
    /**
     * Refreshes the images in the given cam's viewer.
     * If camId is not provided, it refreshes all images.
     * @param {string} [camId] The id of the camera to refresh
     */
}
function refreshImages(camId) {
    // Find all viewer elements
    const viewers = document.querySelectorAll('.cam-viewer');

    // Iterate over each viewer element
    viewers.forEach(viewer => {
        // If the viewer element has the correct camId, update its image
        try {
            if (viewer.dataset.camId === camId) {
                // Construct the new src attribute for the image
                const newSrc = `/upload/${camId}.jpg`;
                // DEBUG:
                console.log(`Refreshing image for camId: ${camId}: ${newSrc}`);

                // Find the existing img element in the viewer
                const img = viewer.querySelector('img');

                // Update the img element's src attribute
                img.src = newSrc;
                // DEBUG:
                console.log('Viewer element:', viewer);
                console.log('Viewer element data-camId:', viewer.dataset.camId);
                console.log('Media src updated to:', newSrc);
            }
            else if (!viewer.dataset.camId) {
                console.log('Viewer element has no camId:', viewer);
            } else {
                console.log("Error")
            }
        } catch (error) {
            console.error('Error refreshing image:', error);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('media-grid').addEventListener('submit', updateMedia);

    // Call refreshImages to display images on initial load
    refreshImages();
})