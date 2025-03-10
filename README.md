# 16-cevibasel-legendenprogramm2025
Developped by [neckXproductions/Yannick Spriessler (©2025)](https://neckxproductions.ch) for the Legendenprogramm 2025 of CEVI Basel.

## Installation

### Setup

## Features
### Cams
8 "Camera" views (a.k.a. image/video tags) are predefined to display images. Each camera can be enlarged by clicking on it, which leads to a new page with the single image of the camera. This is done via a router for each camera, based on the camId:
https://github.com/y-neck/16-cevibasel-legendenprogramm2025/blob/a344f99f8fbd9ed03da8988c788a0c420142dc62/routes/cam.js#L14-L26

The camera names can be globally changed in the `camNames.js` file:
https://github.com/y-neck/16-cevibasel-legendenprogramm2025/blob/4180433ac475fa65b121dffa0806f394d669fb23/src/store/camNames.js#L5-L12

These KV pairs are then passed to the index view via the `camNames` object:
https://github.com/y-neck/16-cevibasel-legendenprogramm2025/blob/9819af032ef3eaf4b4f812fe767cbd2e2b488ca8/server.js#L18-L23

https://github.com/y-neck/16-cevibasel-legendenprogramm2025/blob/9819af032ef3eaf4b4f812fe767cbd2e2b488ca8/routes/cam.js#L14-L26

### Admin backend
The media elements in the frontend can be changed by uploading new images in the admin backend. This is done via a form with a file input for each camera:
https://github.com/y-neck/16-cevibasel-legendenprogramm2025/blob/4306d495467411382ea6426e2dc021f6821c0fd9/src/scripts/media-upload.js#L20-L105

After the image is uploaded, the backend broadcasts an update to all clients. The clients then update the images in the frontend via a websocket:
https://github.com/y-neck/16-cevibasel-legendenprogramm2025/blob/4306d495467411382ea6426e2dc021f6821c0fd9/middleware/upload-router.js#L38-L72

https://github.com/y-neck/16-cevibasel-legendenprogramm2025/blob/4306d495467411382ea6426e2dc021f6821c0fd9/src/scripts/media-upload.js#L8-L18
