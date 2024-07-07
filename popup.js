((execute) => {
  try {
    if (chrome.storage) execute();
    else console.log("can't connect to chrome storage. it's okay.");
  } catch (err) {
    console.log("hmmmm");
  }
})(async function () {
  /**
   * KURURIN Muter Muter !
   *
   * from... herta.eu.org
   * its not stealing
   *
   * i been learning.
   */

  var al = [new Audio("audio/kuruto.mp3"), new Audio("audio/kuru1.mp3"), new Audio("audio/kuru2.mp3")];

  for (const audio of al) {
    audio.preload = "auto";
  }

  var firstSquish = true;
  if (!localStorage.getItem("count")) {
    localStorage.setItem("count", 0);
  }

  // i want to chage this later
  let temporaryCounter = parseInt(localStorage.getItem("count"));

  displayCounter(temporaryCounter);
  document.getElementById("counter-button").addEventListener("click", function () {
    ++temporaryCounter;
    displayCounter(temporaryCounter);
    localStorage.setItem("count", temporaryCounter);

    playKuru();
    spawnHerta();
  });

  function displayCounter(value) {
    document.getElementById("counter").innerText = value.toLocaleString();
    document.getElementById("counter-times").innerText = value === 1 ? "time" : "times";
  }

  function playKuru() {
    var audio;

    if (firstSquish) {
      firstSquish = false;
      audio = al[0].cloneNode();
    } else {
      var random = Math.floor(Math.random() * 2) + 1;
      audio = al[random].cloneNode();
    }

    audio.play();

    audio.addEventListener("ended", function () {
      this.remove();
    });
  }

  function spawnHerta() {
    var id = null;

    var random = Math.floor(Math.random() * 2) + 1;
    var herta = document.createElement("img");
    herta.src = `img/hertaa${random}.webp`;
    herta.style.right = "-170px";
    herta.classList.add("kururin");
    document.getElementById("herta").appendChild(herta);

    var pos = -170;
    var limit = window.innerWidth + 170;
    clearInterval(id);
    id = setInterval(frame, 30);
    function frame() {
      if (pos >= limit) {
        clearInterval(id);
        herta.remove();
      } else {
        pos += 20;
        herta.style.right = pos + "px";
      }
    }
  }
  // End of KURIN Muter Muter

  /**
   *  ? Feature controls
   */
  // theme control
  const theme = await new Promise((res, ex) => {
    chrome.storage.local.get("theme", function (result) {
      var resd = result.theme || false;
      res(resd);
    });
  });

  document.body.setAttribute("dark", theme);
  document.querySelector(".theme-toggle").addEventListener("click", function () {
    const darkAttr = document.body.getAttribute("dark") || "false";
    const isDark = darkAttr == "true" ? false : true;

    document.body.setAttribute("dark", isDark);
    chrome.storage.local.set({ theme: isDark });
  });

  // feature
  async function getData() {
    return new Promise((res, ex) => {
      chrome.storage.local.get("personal", function (result) {
        var resd = result.personal || {};
        res(resd);
      });
    });
  }
  async function pushData(params, value) {
    if (typeof value == "undefined") return;
    const data = await getData();

    data[params] = value;
    chrome.storage.local.set({ personal: data });
  }

  document.querySelectorAll(".config-chekbox").forEach((v) => {
    v.addEventListener("change", function () {
      const id = this.id;
      const status = this.checked;
      pushData(id, status);
      console.log(id, status);
    });
  });
  document.addEventListener("DOMContentLoaded", async function () {
    const data = await getData();
    const keys = Object.keys(data);
    for (const key of keys) {
      const elm = document.getElementById(key);
      if (elm) elm.checked = data[key] || false;
      else {
        delete data[key];
        chrome.storage.local.set({ personal: data });
      }
    }
  });

  // sc: i forgot
  var sitesList = [
    "https://sliding.toys/mystic-square/8-puzzle/",
    "https://longdogechallenge.com/",
    "https://maze.toys/mazes/medium/daily/",
    "https://optical.toys",
    "https://paint.toys/",
    "https://puginarug.com",
    "https://alwaysjudgeabookbyitscover.com",
    "https://checkbox.toys/scale/",
    "https://binarypiano.com/",
    "https://weirdorconfusing.com/",
    "https://mondrianandme.com/",
    "https://onesquareminesweeper.com/",
    "https://cursoreffects.com",
    "http://floatingqrcode.com/",
    "https://thatsthefinger.com/",
    "https://cant-not-tweet-this.com/",
    "http://heeeeeeeey.com/",
    "http://corndog.io/",
    "http://eelslap.com/",
    "http://www.staggeringbeauty.com/",
    "http://burymewithmymoney.com/",
    "https://smashthewalls.com/",
    "https://jacksonpollock.org/",
    "https://clicking.toys/peg-solitaire/english/",
    "http://endless.horse/",
    "http://drawing.garden/",
    // "https://clicking.toys/flip-grid/neat-nine/3-holes/",
    "https://www.trypap.com/",
    "http://www.republiquedesmangues.fr/",
    "http://www.movenowthinklater.com/",
    "https://sliding.toys/klotski/easy-street/",
    "https://paint.toys/calligram/",
    "https://checkboxrace.com/",
    "http://www.rrrgggbbb.com/",
    "http://www.koalastothemax.com/",
    "http://www.everydayim.com/",
    "http://randomcolour.com/",
    "http://maninthedark.com/",
    "http://cat-bounce.com/",
    "http://chrismckenzie.com/",
    "https://thezen.zone/",
    "http://ninjaflex.com/",
    "http://ihasabucket.com/",
    "http://corndogoncorndog.com/",
    "http://www.hackertyper.com/",
    "https://pointerpointer.com",
    "http://imaninja.com/",
    "http://www.partridgegetslucky.com/",
    "http://www.ismycomputeron.com/",
    "http://www.nullingthevoid.com/",
    "http://www.muchbetterthanthis.com/",
    "http://www.yesnoif.com/",
    "http://lacquerlacquer.com",
    "http://potatoortomato.com/",
    "http://iamawesome.com/",
    "https://strobe.cool/",
    "http://thisisnotajumpscare.com/",
    "http://doughnutkitten.com/",
    "http://crouton.net/",
    "http://corgiorgy.com/",
    "http://www.wutdafuk.com/",
    "http://unicodesnowmanforyou.com/",
    "http://chillestmonkey.com/",
    "http://scroll-o-meter.club/",
    "http://www.crossdivisions.com/",
    "http://tencents.info/",
    "https://boringboringboring.com/",
    "http://www.patience-is-a-virtue.org/",
    "http://pixelsfighting.com/",
    "http://isitwhite.com/",
    "https://existentialcrisis.com/",
    "http://onemillionlols.com/",
    "http://www.omfgdogs.com/",
    "http://oct82.com/",
    "http://chihuahuaspin.com/",
    "http://www.blankwindows.com/",
    "http://tunnelsnakes.com/",
    "http://www.trashloop.com/",
    "http://spaceis.cool/",
    "http://www.doublepressure.com/",
    "http://www.donothingfor2minutes.com/",
    "http://buildshruggie.com/",
    "http://buzzybuzz.biz/",
    "http://yeahlemons.com/",
    "http://wowenwilsonquiz.com",
    "https://thepigeon.org/",
    "http://notdayoftheweek.com/",
    "http://www.amialright.com/",
    "https://greatbignothing.com/",
    "https://zoomquilt.org/",
    "https://dadlaughbutton.com/",
    "https://remoji.com/",
    "http://papertoilet.com/",
    "https://loopedforinfinity.com/",
    "https://end.city/",
    "https://www.bouncingdvdlogo.com/",
  ];
  document.getElementById("random-link").addEventListener("click", function () {
    const randomSite = sitesList[Math.floor(Math.random() * sitesList.length)];

    window.open(randomSite, "_blank");
  });
});
