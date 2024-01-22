function generateFileName() {
    const timestamp = new Date().getTime();
    return `video_${timestamp}.mp4`; // You can use a more sophisticated naming scheme
  }


module.exports = {
    generateFileName,
};