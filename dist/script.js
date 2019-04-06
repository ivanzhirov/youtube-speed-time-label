// Application config
const CONFIG = {
  mainClassName: 'speed-time-label',
  rateSpanClass: 'rate-span'
};
const videoElement = document.querySelector('.html5-main-video');

// Initial application
if (!isRateLabelExists() && canAddDurationLabel(videoElement)) {
    addSpeedLabel(videoElement);
    updateSpeedLabel(videoElement);
}

//
// Events
//
videoElement.addEventListener('loadedmetadata', e => {
  const video = e.target;
  if (!isRateLabelExists() && canAddDurationLabel(video)) {
    addSpeedLabel(video);
    updateSpeedLabel(video);
  }
});

videoElement.addEventListener('ratechange', e => {
  const video = e.target;
  if (canAddDurationLabel(video)) {
    if (!isRateLabelExists()) {
      addSpeedLabel(video)
    }
    updateSpeedLabel(video)
  } else {
    cleanDrawSpeedLabel()
  }
});

videoElement.addEventListener('timeupdate', e => {
  const video = e.target;
  if (!isRateLabelExists() && canAddDurationLabel(video)) {
      addSpeedLabel(video)
  }
  updateSpeedLabel(video);
});

//
// Label controls
//
function canAddDurationLabel(video) {
  return (
    video.playbackRate !== 1.0 &&
    !isLive() &&
    isVideoHasMetaData(video)
  );
}


function isLive() {
  const node = document.querySelector('.ytp-live-badge').parentNode;
  return node.classList.contains('ytp-live');
}

function isRateLabelExists() {
  const label = getRateLabel();
  return Boolean(label)
}

function getRateLabel() {
  return document.querySelector(`.${CONFIG.mainClassName}`)
}

function isVideoHasMetaData(video) {
  return Boolean(video && video.duration);
}

function addSpeedLabel(video) {
  const originalTimeLabel = document.querySelector('.ytp-time-display');

  const rateSpan = document.createElement('span');
  rateSpan.textContent = video.playbackRate + 'x';
  rateSpan.classList.add(CONFIG.rateSpanClass);

  const speedLabel = originalTimeLabel.cloneNode(true);
  speedLabel.classList.add(CONFIG.mainClassName);
  speedLabel.querySelector('.ytp-live-badge').remove();
  speedLabel.prepend(rateSpan);

  originalTimeLabel.parentNode.appendChild(speedLabel);
}

function updateSpeedLabel(video) {
  if (!isRateLabelExists()) {
    return
  }

  const speedLabel = getRateLabel();
  const timeLabel = speedLabel.querySelector('.ytp-time-current');
  const durationLabel = speedLabel.querySelector('.ytp-time-duration');
  const rateLabel = speedLabel.querySelector(`.${CONFIG.rateSpanClass}`);

  timeLabel.textContent = msToTime(video.currentTime / video.playbackRate);
  durationLabel.textContent = msToTime(video.duration / video.playbackRate);
  rateLabel.textContent = video.playbackRate + 'x';
}

function cleanDrawSpeedLabel() {
  if (isRateLabelExists()) {
    const speedLabel = getRateLabel();
    speedLabel.remove()
  }
}

//
// Work with data
//
function pad(c) {
    let s = String(c);
    if (s.length < 2) {
      s = "0" + s;
    }
    return s;
}

function msToTime(duration) {
  let  seconds = Math.floor((duration) % 60);
  let  minutes = Math.floor((duration / 60) % 60);
  let  hours = Math.floor((duration / (60 * 60)) % 24);
  if (hours !== 0) {
    return hours + ":" + pad(minutes) + ":" + pad(seconds);
  }
  return minutes + ":" + pad(seconds);
}
