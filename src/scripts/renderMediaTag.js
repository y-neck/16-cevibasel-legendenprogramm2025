/**
 * Return html for rendering an image or video tag based on the given file type
 * @param {string} camId The id of the camera, e.g. 'cam-1'
 * @param {string} fileExtension The file extension of the media file, e.g. 'jpg' or 'mp4'
 * @returns {string} The HTML code for rendering the image or video tag
 */

function renderMediaTag(camId, fileExtension) {
    if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
        return `<img src="/upload/${camId}.${fileExtension}" alt="Kamerabild" class="cam-viewer-img" onerror="this.src='/upload/default.png';">`;
    }

    if (fileExtension === 'mp4') {
        return `<video src="/upload/${camId}.${fileExtension}" class="cam-viewer-img" autoplay muted playsinline></video>`;
    }

    // Fallback: return default image
    return `<img src="/upload/default.png" class="cam-viewer-img">`;
}

module.exports = { renderMediaTag };