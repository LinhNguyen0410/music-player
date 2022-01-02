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
  imageUrl: "",
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  // properties global

  // this === apps (object)
  songs: [
    {
      name: "Đành lòng sau",
      singer: "Anh Rồng",
      path: "https://vnso-zn-5-tf-mp3-320s1-zmp3.zadn.vn/a53a7da35be2b2bcebf3/6754487942023091510?authen=exp=1641195341~acl=/a53a7da35be2b2bcebf3/*~hmac=c2356690af3e25aea4d9f14e574e6149&fs=MTY0MTAyMjU0MTQzNnx3ZWJWNnwxMDAyMjmUsIC0NTmUsIC1fDEyNS4yMzUdUngMjM0LjE2",
      image:
        "https://images.genius.com/775224f5dd4d42988bb0289712d49c84.300x300x1.jpg",
    },
    {
      name: "Rồi nâng cái ly",
      singer: "Nal",
      path: "https://vnso-zn-16-tf-mp3-320s1-zmp3.zadn.vn/112cc519b95850060949/6942370980183748694?authen=exp=1641304335~acl=/112cc519b95850060949/*~hmac=0e4adcc2ef11784ec3940e59cfefa6df&fs=MTY0MTEzMTUzNTM0OXx3ZWJWNnwwfDExMy4xNjEdUngMjEzLjMw",
      image:
        "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/8/4/4/7/844758780c2ff39faebaebaf0626a665.jpg",
    },
    {
      name: "Havana",
      singer: "Camila Cabello",
      path: "https://vnso-zn-5-tf-mp3-320s1-zmp3.zadn.vn/3c393b1160568908d047/6007942069474954845?authen=exp=1641194666~acl=/3c393b1160568908d047/*~hmac=a8f8e19feaa6160a8923b72fc98f6b7b&fs=MTY0MTAyMTg2NjAzOHx3ZWJWNnwwfDE0LjI0NC4xOTkdUngMTE4",
      image:
        "https://toplist.vn/images/800px/havana-camila-cabello-young-thug-206020.jpg",
    },
    {
      name: "One call Away",
      singer: "Charlie Puth",
      path: "https://vnso-zn-10-tf-mp3-320s1-zmp3.zadn.vn/83bbb84b260fcf51961e/2111417469685848686?authen=exp=1641195466~acl=/83bbb84b260fcf51961e/*~hmac=49948871cca96bee39e44330f93b1dc2&fs=MTY0MTAyMjY2NjMwNnx3ZWJWNnwxMDAyMjmUsIC0NTmUsIC1fDEyNS4yMzUdUngMjM0LjE2",
      image: "https://data.chiasenhac.com/data/cover/46/45246.jpg",
    },

    {
      name: "Never be the same ",
      singer: "Camila Cabello",
      path: "https://vnso-zn-24-tf-mp3-320s1-zmp3.zadn.vn/036ba161f7261e784737/7811991917792751387?authen=exp=1641195129~acl=/036ba161f7261e784737/*~hmac=697051b01def11c3882b471d2ab65089&fs=MTY0MTAyMjMyOTmUsIC5OXx3ZWJWNnwxMDAyMjmUsIC0NTmUsIC1fDEyNS4yMzUdUngMjM0LjE2",
      image:
        "https://blog.patrickstereocap.com/wp-content/uploads/edd/2019/10/camila-cabello-never-be-the-same-300x300.jpg",
    },
    {
      name: "Heartbreak anniversary",
      singer: "Giveon",
      path: "https://vnso-zn-23-tf-mp3-320s1-zmp3.zadn.vn/a5b4ce4c3c0bd5558c1a/3495224435121630205?authen=exp=1641195279~acl=/a5b4ce4c3c0bd5558c1a/*~hmac=9e99cd3e036e93d2d210590658ac3f28&fs=MTY0MTAyMjQ3OTI5MXx3ZWJWNnwxMDAyMjmUsIC0NTmUsIC1fDEyNS4yMzUdUngMjM0LjE2",
      image:
        "https://upload.wikimedia.org/wikipedia/en/2/2a/Giveon_-_Heartbreak_Anniversary.png",
    },

    {
      name: "Đèo bòng",
      singer: "Keyo",
      path: "https://vnso-zn-16-tf-mp3-320s1-zmp3.zadn.vn/d233c3c1d7803ede6791/847126668433917740?authen=exp=1641277013~acl=/d233c3c1d7803ede6791/*~hmac=9b9394eb5571263d8e002b9d063401a5&fs=MTY0MTEwNDIxMzI2OHx3ZWJWNnwxMDmUsIC0MTA1NDYzfDEyNS4yMzUdUngMjI3LjIwMA",
      image:
        "https://images.genius.com/a5b612c4bdd74146f7159b5e46cf60de.300x300x1.jpg",
    },

    {
      name: "Mood",
      singer: "Justin Bieber",
      path: "https://vnso-zn-5-tf-mp3-320s1-zmp3.zadn.vn/d1703be9eaae03f05abf/7551304451673558048?authen=exp=1641195014~acl=/d1703be9eaae03f05abf/*~hmac=f582a2ff7bc2959e4e7f6b0ad9efa564&fs=MTY0MTAyMjIxNDY3MXx3ZWJWNnwxMDgwMjM3MjmUsICxfDI3LjY2LjMyLjmUsICy",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2020/11/11/6/5/6/7/1605090321292_640.jpg",
    },
    {
      name: "Go Crazy",
      singer: "Chris Brown, Young Thug",
      path: "https://vnso-zn-10-tf-mp3-320s1-zmp3.zadn.vn/87f0bdafe6e80fb656f9/3202525758056234645?authen=exp=1641195562~acl=/87f0bdafe6e80fb656f9/*~hmac=ae85717ce3e96ad56649da9a06bb3f8c&fs=MTY0MTAyMjmUsIC2MjQxOXx3ZWJWNnwxMDAyMjmUsIC0NTmUsIC1fDEyNS4yMzUdUngMjM0LjE2",
      image:
        "https://i1.sndcdn.com/artworks-pIdveO0Elc63kzj6-PI0uBg-t500x500.jpg",
    },
    {
      name: "Heading Home",
      singer: "Alan Walker",
      path: "https://vnso-zn-24-tf-mp3-320s1-zmp3.zadn.vn/dfeb42d04991a0cff980/1719989138725990736?authen=exp=1641195517~acl=/dfeb42d04991a0cff980/*~hmac=5d95cd1e651a144d3ccd49e047006bbc&fs=MTY0MTAyMjmUsICxNzg3NHx3ZWJWNnwwfDE0LjE3Ni41OS4xMTg",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2020/04/13/4/9/0/0/1586787119941_640.jpg",
    },
    {
      name: "Señorita",
      singer: "Camila Cabello, Shawn Mendes",
      path: "https://vnso-zn-23-tf-mp3-320s1-zmp3.zadn.vn/fb0f99167b51920fcb40/8990096729044148664?authen=exp=1641195207~acl=/fb0f99167b51920fcb40/*~hmac=0ee622794031772d0f8ddeece8d5c62e&fs=MTY0MTAyMjQwNzM4NXx3ZWJWNnwwfDE3MS4yNTIdUngMTU1LjM0",
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
      "https://lh3.googleusercontent.com/proxy/yPlGKQcwhq6HuvgAQ_AYr0VotzHYnArqf4j96PFIius8S8Cxd1qDhJ91dIiKp5nXPOjdmHf6IlRkIUU_vvS9ZuCZHFuvoaUt2m_dnRGv8NdAAPJFlaVxTy2brD-6qRQ",
      "https://upload.wikimedia.org/wikipedia/commons/6/6b/Amazing_River_Flowing_Nature_Wallpapers.jpg",
      "https://images.hdqwalls.com/download/los-santos-gta-v-city-view-92-1920x1080.jpg",
      "https://images.hdqwalls.com/download/los-santos-gta-v-city-view-92-1920x1080.jpg",
      "https://a-static.besthdwallpaper.com/por-do-sol-havaiano-papel-de-parede-1920x1280-26724_38.jpg",
      "https://tophinhanhdep.com/wp-content/uploads/2021/10/1920X1080-HD-Farm-Wallpapers.jpg",
      "https://tophinhanhdep.com/wp-content/uploads/2021/10/1920X1080-HD-Farm-Wallpapers.jpg",
      "https://external-preview.redd.it/bF5fos-C4tYYqgLm71iyj5MCkff6_FwqaTQ01T9xGUc.jpg?auto=webp&s=b885390777645225b34771f0daf0961c2ef3b639",
      "https://cdn.wallpapersafari.com/48/95/lQNn2X.jpg",
      "https://wallpaperaccess.com/full/838020.jpg",
      "https://eskipaper.com/images/dog-close-up-background-1.jpg",
      "https://wallpaperaccess.com/full/847699.jpg",
    ];
    const newIndex = Math.floor(Math.random() * imgList.length);
    this.setConfig("imageUrl", imgList[newIndex]);
    body.style.backgroundImage = `url("${this.imageUrl}") `;
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
    btnChangeBg.on = function (e) {
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
