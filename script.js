// Config
const videoElement = document.querySelector('.html5-main-video');
let speedLabel = null;


// Initial page...
// Todo: find a way with event listener. Seems like doesnt work now
if (canAddDurationLabel(videoElement)) {
    addSpeedLabel(videoElement)
}

//
// Events
//
videoElement.addEventListener('loadedmetadata', e => {
  const video = e.target;
  if (canAddDurationLabel(video)) {
    addSpeedLabel(video)
  }
});

videoElement.addEventListener('ratechange', e => {
  const video = e.target;
  if (canAddDurationLabel(video)) {
    cleanDrawSpeedLabel()
  } else {
    addSpeedLabel(video)
  }
});

videoElement.addEventListener('timeupdate', e => {
  const video = e.target;
  updateSpeedLabel(video);
});

//
// Utils
//

function canAddDurationLabel(video) {
  return video.playbackRate !== 1.0 &&
    document.querySelector('.ytp-live-badge').style.display === 'none';
}

function addSpeedLabel(video) {

  if (!canAddDurationLabel(video)) {
    return;
  }

  const originalTimeLabel = document.querySelector('.ytp-time-display');
  speedLabel = originalTimeLabel.cloneNode(true);
  speedLabel.classList.add('speed-time-label');
  speedLabel.querySelector('.ytp-live-badge').remove();
  originalTimeLabel.parentNode.appendChild(speedLabel);
  updateSpeedLabel(video)
}

function updateSpeedLabel(video) {
  const timeLabel = document.querySelector(
    '.speed-time-label .ytp-time-current');
  const durationLabel = document.querySelector(
    '.speed-time-label .ytp-time-duration');

  console.log('timeLabel', timeLabel)
  console.log('durationLabel', durationLabel)
}

function cleanDrawSpeedLabel() {
  speedLabel.remove()
}
