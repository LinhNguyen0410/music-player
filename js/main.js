/*
 - Todos :
 1. Render Songs -> OK
 2. Play - Pause - Seeks -> OK
 3. CD rodate -> OK
 4. Next / prev
 5. Random
 6. Auto next when ended
 7. Active song
 8. Play when click any song
 9. Scroll to active songs
 10. Handle volume

 ****  duration get length song
 --------------------------------------------------------------------------------------
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
// --------------------------------------------
const body = document.body;
const PLAYER_STORAGE_KEY = "music_play";
const appMusic = $("#container");
const nameSongElement = $(".playing-detail-song");
const nameSingerElement = $(".playing-detail-singer");
const imgThumbnailElement = $(".playing-info img");
const playingAnimation = $(".playing-animation");
const statusTitle = $(".playing-status-title");
const playButton = $(".toggle-button");
const randomButton = $(".action-shuffle-btn");
const previousButton = $(".previous-btn");
const nextButton = $(".next-btn");
const audio = $("#audio");
const range = $("#control-range");
const timeElement = $(".song-duration");
const playList = $(".songs");
const btnChangeBg = $(".change-bg");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isLike: false,
  imageUrl: "https://wallpaperaccess.com/full/847699.jpg",
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  // properties global

  // this === apps (object)
  songs: [
    {
      name: "Đành lòng sau",
      singer: "Anh Rồng",
      path: "./songs/y2meta.com - Đành Lòng Sao - Anh Rồng _ Official MV Lyrics (320 kbps).mp3",
      image:
        "https://images.genius.com/775224f5dd4d42988bb0289712d49c84.300x300x1.jpg",
    },
    {
      name: "Rồi nâng cái ly",
      singer: "Nal",
      path: "./songs/y2meta.com - Rồi Nâng Cái Ly - Nal _ Official Music Video _ Hit Tết 2022 (128 kbps).mp3",
      image:
        "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/8/4/4/7/844758780c2ff39faebaebaf0626a665.jpg",
    },
    {
      name: "Havana",
      singer: "Camila Cabello",
      path: "./songs/y2meta.com - Camila Cabello - Havana (Audio) ft. Young Thug (128 kbps).mp3",
      image:
        "https://toplist.vn/images/800px/havana-camila-cabello-young-thug-206020.jpg",
    },
    {
      name: "One call Away",
      singer: "Charlie Puth",
      path: "./songs/y2meta.com - Charlie Puth - One Call Away [Official Video] (128 kbps).mp3",
      image: "https://data.chiasenhac.com/data/cover/46/45246.jpg",
    },

    {
      name: "Never be the same ",
      singer: "Camila Cabello",
      path: "./songs/y2meta.com - Never Be The Same - Camila Cabello (Lyrics) (128 kbps).mp3",
      image:
        "https://blog.patrickstereocap.com/wp-content/uploads/edd/2019/10/camila-cabello-never-be-the-same-300x300.jpg",
    },
    {
      name: "Heartbreak anniversary",
      singer: "Giveon",
      path: "./songs/y2meta.com - [Vietsub+Lyrics] Heartbreak Anniversary - Giveon (128 kbps).mp3",
      image:
        "https://upload.wikimedia.org/wikipedia/en/2/2a/Giveon_-_Heartbreak_Anniversary.png",
    },

    {
      name: "Dangerously",
      singer: "Charlie Puth",
      path: "./songs/y2meta.com - [Vietsub+Lyrics] Dangerously - Charlie Puth (128 kbps).mp3",
      image: "https://i.scdn.co/image/ab67616d00001e02897f73256b9128a9d70eaf66",
    },

    {
      name: "Mood",
      singer: "Justin Bieber",
      path: "./songs/y2meta.com - [Vietsub + Lyric] 24Kgoldn - Mood (remix) _ Music Tik Tok (128 kbps).mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2020/11/11/6/5/6/7/1605090321292_640.jpg",
    },
    {
      name: "Go Crazy",
      singer: "Chris Brown, Young Thug",
      path: "./songs/y2meta.com - Leslie Odom Jr. - Go Crazy (Official Video) (128 kbps).mp3",
      image:
        "https://i1.sndcdn.com/artworks-pIdveO0Elc63kzj6-PI0uBg-t500x500.jpg",
    },
    {
      name: "Heading Home",
      singer: "Alan Walker",
      path: "./songs/y2meta.com - Alan Walker & Ruben – Heading Home (Official Music Video) (128 kbps).mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2020/04/13/4/9/0/0/1586787119941_640.jpg",
    },
    {
      name: "Señorita",
      singer: "Camila Cabello, Shawn Mendes",
      path: "./songs/y2meta.com - Shawn Mendes, Camila Cabello - Señorita (128 kbps).mp3",
      image:
        "https://cdn.promodj.com/afs/270f6e6b9a124124b616adafbb9b401512:resize:3000x3000:same:promodj:640f47",
    },
  ],

  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isLike = this.config.isLike;
    this.imageUrl = this.config.imageUrl;
  },

  renderQtySong: function () {
    const qtyOfListSong = this.songs.length;
    const templateQtySongs = $("#templateRenderQuantity");
    const elementRenderQty = $(".list-header-right");

    if (!templateQtySongs || !qtyOfListSong || !elementRenderQty) return;
    const spanElement =
      templateQtySongs.content.firstElementChild.cloneNode(true);
    spanElement.textContent = `${qtyOfListSong} songs on the list 💗`;

    elementRenderQty.appendChild(spanElement);
  },

  renderListSong: function () {
    const htmlList = this.songs.map((song, index, listSong) => {
      return `       
    <li data-id = "${index}"class="song-item ${
        index === this.currentIndex ? "active-song" : ""
      }">
      <div class="song-item-info">
        <span class="song-numerical">${index++}</span>
        <div class="song-thumbnail">
          <img
            src="${song.image}"
            alt="${index++}"
          />
        </div>
        <div class="song-name-singer">
          <span class="song-name">${song.name} </span>
          <span class="song-singer">${song.singer}</span>
        </div>
      </div>
      <div class="song-item-time">
        <ion-icon
          class="song-like"
          name="heart-outline"
        ></ion-icon>
      </div>
    </li>`;
    });

    if (playList) playList.innerHTML = htmlList.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  loadCurrentSong: function () {
    if (!nameSongElement || !nameSingerElement || !imgThumbnailElement) return;
    const song = this.currentSong;
    nameSongElement.textContent = song.name;
    nameSingerElement.textContent = song.singer;
    imgThumbnailElement.src = song.image;
    audio.src = song.path;
  },

  nextSong: function () {
    this.currentIndex++;
    this.currentIndex >= this.songs.length
      ? (this.currentIndex = 0)
      : this.currentIndex;
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    this.currentIndex < 0
      ? (this.currentIndex = this.songs.length - 1)
      : this.currentIndex;
    this.loadCurrentSong();
  },

  randomSong: function () {
    // create a new index about songs length with conditon it can't match currentIndex <=> never satisfy conditon inside while loop
    let indexRandom;
    do {
      indexRandom = Math.floor(Math.random() * this.songs.length);
    } while (indexRandom === this.currentIndex);

    this.currentIndex = indexRandom;
    this.loadCurrentSong();
  },

  changeBackground: function () {
    const imgList = [
      "https://images2.alphacoders.com/238/thumb-1920-238870.jpg",
      "https://wallpaper-mania.com/wp-content/uploads/2018/09/High_resolution_wallpaper_background_ID_77701329839.jpg",
      "https://images4.alphacoders.com/102/thumb-1920-1029784.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/Amazing_River_Flowing_Nature_Wallpapers.jpg",
      "https://images.hdqwalls.com/download/los-santos-gta-v-city-view-92-1920x1080.jpg",
      "https://images.hdqwalls.com/download/los-santos-gta-v-city-view-92-1920x1080.jpg",
      "https://tophinhanhdep.com/wp-content/uploads/2021/10/1920X1080-HD-Farm-Wallpapers.jpg",
      "https://tophinhanhdep.com/wp-content/uploads/2021/10/1920X1080-HD-Farm-Wallpapers.jpg",
      "https://cdn.wallpapersafari.com/48/95/lQNn2X.jpg",
      "https://cdn.wallpapersafari.com/48/95/lQNn2X.jpg",
      "https://eskipaper.com/images/dog-close-up-background-1.jpg",
      "https://wallpaperaccess.com/full/847699.jpg",
      "https://a-static.besthdwallpaper.com/hoang-hon-tren-bien-hinh-nen-1920x1280-22171_38.jpg",
      "https://wallpaperaccess.com/full/117983.jpg",
      "https://wallpaperaccess.com/full/6512.jpg",
      "https://wallpaperaccess.com/full/1631415.jpg",
    ];
    const newIndex = Math.floor(Math.random() * imgList.length);
    console.log(newIndex);
    this.setConfig("imageUrl", imgList[newIndex]);
    body.style.backgroundImage = `url("${this.imageUrl}")`;

    location.reload();
  },

  // after click next-prev handle scroll to active song into view => delay about 4s
  scrollToActiveSong: function () {
    // scrollIntoView is method of javascript
    setTimeout(() => {
      $(".song-item.active-song").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 2000);
  },

  handleEvents: function () {
    // this ( app ) will can not using in onclick func...=> it is other method => and it point to element trigger event
    const _this = this;
    if (!audio) return;

    // ..handle rotate for CD when play - pause  => note : don't rotate it when start.
    const thumbAnimate = imgThumbnailElement.animate(
      [{ transform: "rotate(360deg)" }],
      {
        duration: 6000,
        iterations: Infinity,
      }
    );
    thumbAnimate.pause();

    // ..handle event when play music
    playButton.onclick = function () {
      _this.isPlaying ? audio.pause() : audio.play();
    };

    audio.onplay = function () {
      _this.isPlaying = true;
      statusTitle.textContent = "Music Playing";
      statusTitle.style.color = "green";
      thumbAnimate.play();
      appMusic.classList.add("music-playing");
      playingAnimation.style.display = "inline-block";
    };

    audio.onpause = function () {
      _this.isPlaying = false;
      statusTitle.textContent = "Music Pause";
      statusTitle.style.color = "#494949";
      thumbAnimate.pause();
      appMusic.classList.remove("music-playing");
      playingAnimation.style.display = "none";
    };

    //.. time change when song playing
    audio.ontimeupdate = function () {
      const durationSong = audio.duration;
      const timeChange = audio.currentTime;
      if (!range || !durationSong || !timeChange) return;
      const songProgressPercent = (timeChange / durationSong) * 100;
      range.value = songProgressPercent;

      // calculating and show time in UI
      let minuties = Math.trunc(timeChange / 60);

      let seconds = Math.trunc(timeChange);
      const resetSeconds =
        seconds > 60 ? (seconds = seconds - minuties * 60) : seconds;

      const patternSeconds = seconds < 10 ? `0${seconds}` : seconds;
      const patternTime = `0${minuties}:${patternSeconds}`;
      timeElement.textContent = patternTime;
    };

    //..handle when rewind the song
    range.onchange = function (e) {
      const currentPercent = e.target.value;
      //..need calculating seconds number from percent above = percent x duration / 100 (99% x 60 / 100 = 59.4s)
      const currentSeconds = (currentPercent * audio.duration) / 100;
      audio.currentTime = currentSeconds;
    };

    //.. handle event when next - prev song
    nextButton.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.renderListSong();
      _this.scrollToActiveSong();
    };

    previousButton.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.renderListSong();
      _this.scrollToActiveSong();
    };

    //.. handle event when turn on , turn off random
    randomButton.onclick = function (e) {
      _this.isRandom = !_this.isRandom; // toggle random status
      _this.setConfig("isRandom", _this.isRandom);
      randomButton.classList.toggle("active-random", _this.isRandom);
      // tham số thứ 2 của thằng toggle là boolean => true sẽ add class , false sẽ ko add class
    };

    //.. when audio ended => handle auto next
    audio.onended = function () {
      nextButton.click(); // cho nó auto bấm
    };

    //.. listen event click for song item from to parent of itself  (delegation)
    playList.onclick = function (e) {
      //  using closest : only using elements inside class 'song-item 'and without class 'active-song' except icon like
      const element = e.target;
      const songNotActive = element.closest(".song-item:not(.active-song)");
      const elementLike = element.closest(".song-like");
      // will allow click
      if (songNotActive || elementLike) {
        // when click correct song...
        if (songNotActive && !elementLike) {
          _this.currentIndex = Number(songNotActive.dataset.id);
          _this.loadCurrentSong();
          _this.renderListSong();
          _this.scrollToActiveSong();
          audio.play();
        }
        if (elementLike) {
          elementLike.name === "heart-outline"
            ? elementLike.setAttribute("name", "heart-circle-outline")
            : elementLike.setAttribute("name", "heart-outline");
        }
      }
    };

    //.. change background body
    btnChangeBg.onclick = function (e) {
      _this.changeBackground();
    };
  },

  showFirstStatusApp: function () {
    randomButton.classList.toggle("active-random", this.isRandom);
    body.style.backgroundImage = `url("${this.imageUrl}")`;
  },

  start: function () {
    // load config from local storage
    this.loadConfig();

    //.. define and save property for object app => call app.currentSong will get current song and using it anywhere inside app
    this.defineProperties();

    //.. handle dom event
    this.handleEvents();

    // .. render quantity of song
    this.renderQtySong();

    //.. load song and show on UI when start app
    this.loadCurrentSong();

    //.. render list song
    this.renderListSong();

    // .. show first status of random mode
    this.showFirstStatusApp();
  },
};
app.start();
