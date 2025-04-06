const socket = new WebSocket('ws://localhost:4051');

/**
 * WS Listener: Update media when notified by backend
 * @param {*} event: The event object containing the received message from the backend
 */
socket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket message:', data);
        if (data.action === 'update' && data.camId && data.fileType) {
            refreshImages(data.camId, data.fileType);
        }
    }
    catch (error) {
        console.error('Error parsing JSON:', error);
    }
};

/**
 * Update media via upload/store
 * Handle form submission to upload media files and notify clients via websocket   
*/
async function updateMedia() {
    event.preventDefault(); // prevent page reload
    // Get form data
    const form = document.getElementById('media-grid');
    const formData = new FormData();
    const uploadedMedia = [];

    // Get file inputs from form
    const fileInputs = form.querySelectorAll('input[type="file"]');

    // Loop through file inputs and add to form data
    fileInputs.forEach(fileInput => {
        const file = fileInput.files[0];
        if (file) {
            // Add file to form data
            formData.append(fileInput.id, file);
            // Store camId and fileType of uploaded media
            uploadedMedia.push({
                camId: fileInput.dataset.camId, // Get camId from data attribute
                fileType: file.type // Get file type from file input
            });
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
            uploadedMedia.forEach(({ camId, fileType }) => {
                // WS Broadcast update to all clients
                socket.send(JSON.stringify({
                    action: 'update', camId, fileType
                }));
                refreshImages(camId, fileType);
                // DEBUG:
                console.log('File of type', fileType, 'uploaded successfully');
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
}

/**
 * Helper function to get file type  
 * @param {string} fileType The type of the file
 * @returns {string} The file type extension
 */
function getExtension(fileType) {
    switch (fileType) {
        case 'image/jpeg':
        case 'image/jpg':
            return 'jpg';
        case 'video/mp4':
            return 'mp4';
        default:
            console.warn('Unknown file type:', fileType);
            return null;
    }
}

/**
 * Refreshes the images in the given cam's viewer.
 * If camId is not provided, it refreshes all images.
 * @param {string} camId The id of the camera to refresh
 * @param {string} fileType The mime type of the file to refresh
*/
function refreshImages(camId, fileType) {
    // Get file extension
    const extension = getExtension(fileType);
    if (!extension) return;

    // Find all viewer elements
    const viewers = document.querySelectorAll('.cam-viewer');
    // Storage item as object
    const camStorage = JSON.parse(sessionStorage.getItem('camStorage')) || {};

    // Iterate over each viewer element
    viewers.forEach(viewer => {
        // If the viewer element has the correct camId, update its image
        try {
            if (viewer.dataset.camId === camId) {
                // Construct the new src attribute for the image
                const newSrc = `/upload/${camId}.${extension}`;
                // DEBUG:
                console.log(`Refreshing media for camId: ${camId}: ${newSrc}`);

                // Find the existing media element in the viewer
                let mediaElement = viewer.querySelector('img') || viewer.querySelector('video');
                if (!mediaElement) {
                    // DEBUG:
                    console.error('No media element found for camId:', camId);
                    return
                };

                const isVideo = extension === 'mp4';
                // If the new type is video but current element is not a video, replace it
                if (isVideo && mediaElement.tagName.toLowerCase() !== 'video') {
                    mediaElement.remove();
                    const videoElem = document.createElement('video');
                    videoElem.src = newSrc;
                    videoElem.classList.add('cam-viewer-img');
                    // Video playback handling
                    videoElem.autoplay = true;                 // JS property
                    videoElem.muted = true;                   // JS property
                    videoElem.playsInline = true;             // JS property
                    videoElem.setAttribute('autoplay', '');   // HTML attribute
                    videoElem.setAttribute('muted', '');      // HTML attribute
                    videoElem.setAttribute('playsinline', ''); // HTML attribute
                    viewer.appendChild(videoElem);
                    console.log(`Replaced image with video for ${camId}: ${newSrc}`);
                }
                // If new type is image but current element is not an image, replace it
                else if (!isVideo && mediaElement.tagName.toLowerCase() !== 'img') {
                    mediaElement.remove();
                    const imgElem = document.createElement('img');
                    imgElem.src = newSrc;
                    imgElem.classList.add('cam-viewer-img');
                    imgElem.alt = 'Kamerabild';
                    imgElem.onerror = () => { imgElem.src = '/upload/default.png'; };
                    viewer.appendChild(imgElem);
                    console.log(`Replaced video with image for ${camId}: ${newSrc}`);
                }
                else {
                    // If element type is correct, simply update the src if needed
                    if (mediaElement.src !== newSrc) {
                        mediaElement.src = newSrc;
                        console.log(`Media src updated for ${camId}: ${newSrc}`);
                    }
                }

                // Store in / update session storage
                camStorage[camId] = newSrc;
                // DEBUG:
                console.log('Local storage updated for camId:', camId, mediaElement.src);
            } else if (!viewer.dataset.camId) {
                console.log('Viewer element has no camId:', viewer);
            } else {
                console.log("Error", viewer);
                return;
            }
        }
        catch (error) {
            console.error('Error refreshing media:', error);
        };
    });
    // Save to session storage
    sessionStorage.setItem('camStorage', JSON.stringify(camStorage));
    // DEBUG:    
    console.log('Session storage updated:', sessionStorage.getItem('camStorage'));
};

document.addEventListener('DOMContentLoaded', () => {
    // If on admin backend, add submit listener to trigger media upload
    if (window.location.pathname === '/admin/backend') {
        document.getElementById('media-grid').addEventListener('submit', updateMedia);
    }
}
);