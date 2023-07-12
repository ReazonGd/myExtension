((execute) => {
  try {
    if (chrome) execute();
    else console.log("log");
  } catch (err) {
    console.log("log");
  }
})(async function () {
  /**
   * KURURIN Muter Muter !
   *
   * from... herta.eu.org
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

  document.getElementById("counter-button").addEventListener("click", counterClick);
  displayCounter(temporaryCounter);

  function counterClick() {
    ++temporaryCounter;
    displayCounter(temporaryCounter);
    localStorage.setItem("count", temporaryCounter);

    playKuru();
    spawnHerta();
  }

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
   *  Feature controls
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

  // dadfklcja9ihna8ophf7y
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
      document.getElementById(key).checked = data[key] || false;
    }
  });
});
