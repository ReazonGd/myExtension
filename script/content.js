/**
 * #====================#
 * # personal Extension #
 * #====================#
 *
 * Author : Reazon Gd
 */
(async function (callback) {
  chrome.storage.local.get("personal", function (localData) {
    callback(localData.personal || {});
  });
})(async function (localData) {
  const location = window.location;
  const getLocaldata = function (name) {
    return localData[name] ?? false;
  };
  const delay = (m = 1000) => new Promise((o, p) => setTimeout(o, m));
  const log = function (...message) {
    // if (!getLocaldata("enable.debug")) return;
    console.log("[Personal Extension] ", ...message);
  };

  log("starting..");

  const { href, host, pathname } = location;
  const generateElement = function ({ name, attr }) {
    if (!(name && typeof name === "string")) throw Error("Please use proper name");
    const element = document.createElement(name);
    if (attr) {
      Object.keys(attr).forEach(function (nameSpace) {
        element.setAttribute(nameSpace, attr[nameSpace]);
      });
    }
    return element;
  };

  const setNotification = function (message) {
    const notifElem = generateElement({ name: "div", attr: { style: "background: #000; color: #fff; padding: 5px 7px; position: fixed; left: 50%; bottom: 20%; z-index: 9999; transform: translateX(-50%)" } });
    notifElem.innerText = message;
    document.body.appendChild(notifElem);
    setTimeout(function () {
      document.body.removeChild(notifElem);
    }, 1000);
    // alert(message);
  };

  const waitLoadedElement = (selector) => {
    return new Promise((resolve, reject) => {
      const ObservedElement = document.querySelector(selector);
      if (ObservedElement) return resolve(ObservedElement);

      const Observer = new MutationObserver(() => {
        const ObservedElement = document.querySelector(selector);
        if (ObservedElement) {
          resolve(ObservedElement);
          Observer.disconnect();
        }
      });

      Observer.observe(document.documentElement, { childList: !0, subtree: !0 });
    });
  };

  function content() {
    return "content";
  }
  content.nimegami = function () {
    const linkElements = document.querySelectorAll("#LinkDownload > div > ul > li > a, #LinkDownload > div > div > ul > li > a");

    log("founded %s links", linkElements.length);
    let completeCount = 0;
    linkElements.forEach(async function (Element, key) {
      const adsLink = Element.getAttribute("href");
      if (!adsLink.startsWith("https://")) return;

      const encodedLink = new URLSearchParams(new URL(adsLink).search).get("safe_url_data");
      if (!encodedLink) return;

      const elementBackground = Element.style.background;
      Element.style.background = "#7e6bc2";

      let decodedLink = atob(encodedLink);
      if (decodedLink.startsWith("https://mitedrive.com") && getLocaldata("generateMiteN")) {
        const mitedriveId = decodedLink
          .split("/")
          .filter((v) => v)
          .pop();
        const request = await fetch("https://mitedrive.com/api/generate", {
          method: "POST",
          body: JSON.stringify({ short_url: mitedriveId }),
        });

        const { data } = await request.json();
        if (data || data.url) decodedLink = data.url;
      }

      setTimeout(function () {
        Element.setAttribute("href", decodedLink);
        Element.style.bacground = elementBackground;

        completeCount++;
        if (completeCount === linkElements.length) setNotification("complete to change url.");
      }, Math.random() * 5 * 500);
    });
  };

  content.bootstraps = function () {
    if (pathname === "/") {
      console.log('were on "/" path');
    } else if (pathname === "/icons") {
      console.log('were on "/icons" path');
    }
  };

  content.youtube = function () {
    async function addSection() {
      // new location
      const { href, host, pathname } = window.location;
      if (pathname !== "/watch") return;
      // while (!document.querySelector("#above-the-fold #description")) {
      //   await delay(500);
      // }
      await waitLoadedElement("#above-the-fold #description");
      await delay(500);
      // clearing last section
      const personalEx = document.getElementById("personal-Extension");
      if (personalEx) personalEx.parentNode.removeChild(personalEx);

      // the container
      const container = generateElement({ name: "div", attr: { id: "personal-Extension", style: `padding: 10px 16px;font-size: 1.4em;margin-top: 7px;background: var(--yt-spec-badge-chip-background);border-radius: 10px;display: flex;align-items: center;` } });
      container.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" stroke="currentColor" style="margin-right: 7px;" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>Download :';

      // copy link video
      const copyLink = generateElement({ name: "p", attr: { style: "color: var(--yt-spec-text-secondary);cursor: pointer;margin-left: 7px;padding: 7px 8px;background: #fff1;border-radius: 7px;display: flex;align-items: center;" } });
      copyLink.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16"><path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/><path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/></svg>';
      copyLink.addEventListener("click", async () => {
        const url = `https://www.youtube.com/watch?v=${new URLSearchParams(new URL(href).searchParams).get("v")}`;
        await navigator.clipboard.writeText(url);
        setNotification("copied!");
      });

      function createLinkElement(name, href, qq = !1) {
        const element = generateElement({ name: "a", attr: { target: "_blank", href, style: `color: var(--yt-spec-text-secondary);margin-left: ${qq ? "auto" : "7px"};padding: 7px 8px;background: #0001;border-radius: 7px;text-decoration: none;` } });
        element.innerText = name;
        return element;
      }

      const parameter = new URLSearchParams(new URL(href).search).get("v");
      container.appendChild(createLinkElement("SaveFrom", `https://savefrom.net/?url=https://www.youtube.com/watch?v=${parameter}`, !0));
      container.appendChild(createLinkElement("getmp3", "https://getn.topsandtees.space/"));
      container.appendChild(createLinkElement("y2mate", `https://www.youtubepp.com/watch?v=${parameter}`));
      container.appendChild(copyLink);

      //   //
      // document.querySelector("#above-the-fold").__shady_appendChild(container);
      document.querySelector("#above-the-fold").appendChild(container);
      await delay(845);
      if (!document.querySelector("#above-the-fold #personal-Extension")) addSection();
    }

    addSection();
    document.addEventListener("yt-navigate-finish", addSection);
  };

  content.youtubeAdsAutoHasInit = false;
  content.youtubeAdsAuto = async function () {
    //  ? well, you can change variable below to zero to immediately skiping ads
    const waitUntil = 5.3;

    async function AutoSkipWhenTheSkipButtonDisplayed() {
      const { href, host, pathname } = window.location;
      if (pathname !== "/watch") return;

      if (content.youtubeAdsAutoHasInit) return;
      content.youtubeAdsAutoHasInit = true;
      const playerElemet = await waitLoadedElement("#movie_player");

      const observer = new MutationObserver(async () => {
        const playerElemet = await waitLoadedElement("#movie_player");
        const AdsAppears = playerElemet.classList.contains("ad-interrupting") || playerElemet.classList.contains("ad-showing");
        if (AdsAppears) {
          const videoPlayer = await waitLoadedElement(".video-stream");

          // skiping ads
          if (videoPlayer.currentTime > waitUntil) {
            document.querySelector(".ytp-ad-skip-button")?.click();
            document.querySelector(".ytp-skip-ad-button")?.click();
            document.querySelector(".ytp-ad-skip-button-modern")?.click();
            document.querySelector(".ytp-ad-survey")?.click();

            videoPlayer.currentTime = videoPlayer.duration - 0.3;
            videoPlayer.paused && videoPlayer.play();
          }
        }
      });

      observer.observe(playerElemet, {
        attributes: true,
        childList: true,
        subtree: true,
        // attributeOldValue: true,
      });
    }
    await AutoSkipWhenTheSkipButtonDisplayed();
    document.addEventListener("yt-navigate-finish", AutoSkipWhenTheSkipButtonDisplayed);
  };

  const commands = {
    "nimegami.id": [
      {
        name: "decodeNimegami",
        run: content.nimegami,
      },
    ],
    "icons.getbootstrap.com": [
      {
        name: "bootstrap.ico-feature",
        run: content.bootstraps,
      },
    ],
    "www.youtube.com": [
      {
        name: "youtube.download.link",
        run: content.youtube,
      },
      {
        name: "youtube.auto.skip",
        run: content.youtubeAdsAuto,
      },
    ],
  };

  try {
    if (!(localData && commands[host] && commands[host].length > 0)) return;
    commands[host].forEach((v, i) => {
      if (!getLocaldata(v.name)) return;
      v.run();
      console.log("Load feature %s on %s...", v.name, host);
    });
  } catch (error) {
    console.error(error);
  }
});
