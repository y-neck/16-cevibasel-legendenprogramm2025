document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('media-grid').addEventListener('submit', updateMedia);
})

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
    function refreshImages() {
        document.querySelectorAll('.cam-viewer').forEach(viewer => {
            const camId = viewer.dataset.camId;
            const mediaType = viewer.dataset.mediaType; // Assume mediaType is stored in data attribute
            const mediaElement = mediaType === 'video' ? 'video' : 'img';
            const media = viewer.querySelector(mediaElement);

            if (media) {
                media.src = `/upload/${camId}.${mediaType === 'video' ? 'mp4' : 'jpg'}`;
            } else {
                const newMedia = document.createElement(mediaElement);
                newMedia.src = `/upload/${camId}.${mediaType === 'video' ? 'mp4' : 'jpg'}`;
                if (mediaElement === 'video') {
                    newMedia.controls = true;
                }
                viewer.appendChild(newMedia);
            }
        });
    }
}
