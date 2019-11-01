var musicList = []
var currentIndex = 0
var audio = new Audio()
audio.autoplay = true

function $(selector) {
  return document.querySelector(selector)
}

getMusicList(function(list) {
  musicList = list
  loadMusic(list[currentIndex])
  setMusicList(list)
})
audio.ontimeupdate = function () {
  console.log(this.currentTime)
  $('.musicBox .timeNow').style.width = (this.currentTime/this.duration)*100 + '%'
}

audio.onplay = function () {
  clock = setInterval(function () {
    var min = Math.floor(audio.currentTime/60)
    var sec = Math.floor(audio.currentTime)%60 + ''
    sec = (sec.length === 2) ? sec : '0' + sec
    $('.musicBox .playTime').innerText = min + ':' + sec
  }, 1000)
}
audio.onpause = function () {
  clearInterval(clock)
}
audio.onended = function () {
  currentIndex = (++currentIndex)%musicList.length
  loadMusic(musicList[currentIndex])
}

//歌曲的暂停播放
$('.musicBox .playBtn').onclick = function () {
  if (audio.paused) {
    audio.play()
    this.classList.remove('icon-pause')
    this.classList.add('icon-play')
  } else {
    audio.pause()
    this.classList.add('icon-pause')
    this.classList.remove('icon-play')
  }
}
$('.musicBox .btn .icon-step-forward').onclick = function () {
  currentIndex = (++currentIndex)%musicList.length
  console.log(currentIndex)
  loadMusic(musicList[currentIndex])
}
$('.musicBox .btn .icon-step-backward').onclick = function () {
  currentIndex = (musicList.length + (--currentIndex))%musicList.length
  console.log(currentIndex)
  loadMusic(musicList[currentIndex])
}

$('.musicBox .timeProgress .timebar').onclick = function (e) {
  console.log(e)
  var percent = e.offsetX / parseInt(getComputedStyle(this).width)
  console.log(percent)
  audio.currentTime = audio.duration * percent
}
function getMusicList(callback) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', './music.json', true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 ) {
        // console.log(JSON.parse(xhr.responseText))
        callback(JSON.parse(xhr.responseText))
      } else {
        console.log('获取数据失败')
      }
    }
  }
  xhr.onerror = function () {
    console.log('网络异常')
  }
  xhr.send()
}

// 获取播放列表
function setMusicList(list) {
  var fragment = document.createDocumentFragment()
  var Ul = $('.container .songList')
  for (var i = 0; i < list.length; i++) {
    var li = document.createElement('li')
    li.innerText = list[i].title + '-' + list[i].auther
    fragment.appendChild(li)
}
  Ul.appendChild(fragment)
}
// 点击播放列表的歌曲
$('.container .songList').addEventListener('click', function (e) {
  if (e.target.tagName.toLowerCase() === 'li') {
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].classList.remove('showPlay')
      if (this.children[i] === e.target) {
        currentIndex = i
        e.target.classList.add('showPlay')
      } 
    }
    loadMusic(musicList[currentIndex])
  }
}, false)
// 加载歌曲信息
function loadMusic(musicObj) {
  console.log('begin play', musicObj)
  $('.musicBox .songName').innerText = musicObj.title
  $('.musicBox .singer').innerText = musicObj.auther
  audio.src = musicObj.src
}



