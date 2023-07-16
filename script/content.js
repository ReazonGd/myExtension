// Author: Reazon / Khafid

// main content
(async (execute) => {
  execute(); // dont ask me
})(async () => {
  let delay = (m = 1000) => new Promise((o, p) => setTimeout(o, m));
  let url = window.location.href.replace(/(^\w+:|^)\/\//, "");
  let domain = url.split("/")[0];
  // st = st.split(".").slice(-2).join(".");
  const data = await getData();

  // the nimegami is a platform to streaming or downloading anime (illegal)
  // this script, change the download link.
  if (domain == "nimegami.id") {
    if (!data["bootstrap.ico-feature"]) return;
    const removeLoading = await spawnLoadingBar();
    const allLinks = document.querySelectorAll("a[title][href][target][rel][data-wpel-link]");

    // lets make it cool 😎
    for (const a of allLinks) {
      const adsLink = a.getAttribute("href");
      if (!adsLink.includes("?safe_url_data=")) continue;
      const linkBackground = a.style.background;
      a.style.background = "#7e6bc2";
      const base64 = adsLink.split("?safe_url_data=").pop();
      const realLink = atob(base64);
      let link = realLink;

      // generating link. (its temporary use)
      if (realLink.startsWith("https://mitedrive.com") && data.generateMiteN) {
        const yd = realLink.split("/view/").pop();
        const r = await fetch(`https://mitedrive.com/api/generate/`, {
          method: "POST",
          body: JSON.stringify({ short_url: yd }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await r.json();
        link = response.data.url ? response.data.url : realLink;
      }
      // remove this (if you want)
      await delay(Math.floor(Math.random() * 3) * 200);
      a.setAttribute("href", link);
      a.style.background = linkBackground;
    }
    removeLoading();

    // it's remind me..
    // why i do this..
  } else if (domain.includes("icons.getbootstrap")) {
    if (!data["bootstrap.ico-feature"]) return;
    const removeLoading = await spawnLoadingBar();
    if (url.includes("/icons/")) {
      const a = document.querySelectorAll(".col-lg-4.mb-4 .btn.btn-bd-primary.mb-4")[0];
      const url = a.href;
      fetch(url)
        .then((response) => response.blob())
        .then(async (blob) => {
          const base = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          a.innerText = "Copy As Base64";
          a.href = "#";
          a.removeAttribute("download");
          a.addEventListener("click", (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(base);
          });

          return removeLoading();
        });
    } else {
      const iconBox = document.querySelectorAll("li a.d-block.text-body-emphasis.text-decoration-none");
      if (iconBox.length == 0) return removeLoading();
      for (const icon of iconBox) {
        icon.target = "_blank";
      }
      return removeLoading();
    }
  }

  // get the data from chrome storage
  function getData() {
    return new Promise((res, ex) => {
      chrome.storage.local.get("personal", function (result) {
        var data = result.personal || {};
        res(data);
      });
    });
  }

  // dont ask me
  function spawnLoadingBar() {
    return new Promise(async function (exit, err) {
      const theme = await new Promise((res, ex) => {
        chrome.storage.local.get("theme", function (result) {
          var resd = result.theme || false;
          res(resd);
        });
      });
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href =
        "data:text/css;base64,QGtleWZyYW1lcyBwZXJzb25hbExvYWRlckxvYWRpbmcgezAlIHtiYWNrZ3JvdW5kLXBvc2l0aW9uOiAyMDAlIDUwJTt9MTAwJSB7YmFja2dyb3VuZC1wb3NpdGlvbjogMCUgNTAlO319DQojcGVyc29uYWwtbG9hZGVyIC5sb2FkaW5nIHtiYWNrZ3JvdW5kOiAjOWQ4OGQzO2FzcGVjdC1yYXRpbzogMTAvMTtkaXNwbGF5OiBmbGV4O2FsaWduLWl0ZW1zOiBjZW50ZXI7anVzdGlmeS1jb250ZW50OiBjZW50ZXI7YmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLCAjNDEyMTkxLCAjNDgwMGZmKTtiYWNrZ3JvdW5kLXNpemU6IDIwMCUgMTAwJTthbmltYXRpb246IHBlcnNvbmFsTG9hZGVyTG9hZGluZyAxLjVzIGluZmluaXRlO2NvbG9yOiAjZmZmO2ZvbnQtd2VpZ2h0OiA2MDA7aGVpZ2h0OiAzNXB4O30NCiNwZXJzb25hbC1sb2FkZXIge2JhY2tncm91bmQ6ICNmZmZmZmY7cGFkZGluZzogMTBweCAyMHB4O21hcmdpbjogMTBweCA3cHg7cG9zaXRpb246IGZpeGVkO3otaW5kZXg6IDk5OTk5O21hcmdpbjogMTBweCA3cHg7cG9zaXRpb246IGZpeGVkO2JvdHRvbTogLTEwMCU7cmlnaHQ6IDA7ZGlzcGxheTogZmxleDthbGlnbi1pdGVtczogY2VudGVyO2p1c3RpZnktY29udGVudDogY2VudGVyO2dhcDogMTBweDt0cmFuc2l0aW9uOiBhbGwgMzAwbXM7fQ0KI3BlcnNvbmFsLWxvYWRlcltkYXJrXSB7YmFja2dyb3VuZDogIzE5MTgxYjt9DQojcGVyc29uYWwtbG9hZGVyLCNwZXJzb25hbC1sb2FkZXIgLmxvYWRpbmcsI3BlcnNvbmFsLWxvYWRlciBpbWcge2JvcmRlci1yYWRpdXM6IDEwcHg7Ym94LXNoYWRvdzogMHB4IDJweCAxcHggIzAwMDM7fQ0KI3BlcnNvbmFsLWxvYWRlciBpbWcge2JhY2tncm91bmQ6ICM0MTIxOTE7aGVpZ2h0OiAyNXB4O3BhZGRpbmc6IDVweDt9";
      const personalLoader = document.createElement("div");
      const loading = document.createElement("div");
      const img = document.createElement("img");
      img.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFxAAABcQARhhEdsAAAIxSURBVGhD7ZjbUcQwDEV3+WcGOqAE6AQ6gg7oBDqgBLYD6ABmKAB0nZvM2ivJjzhLPnJ+5JeuZclJFnYbG2fiV2BzVexpXY6D3wtsroILWhOJ/YPNwNoq4WbTC3YtlXArwCDvhl5Mr0pAB7BbTfUzkDKnEiJ7JeZr6LVpFTsscQhNs1Yr+xCPeMLe4SzE5Y3NCGgBdrNUnTYnXJM9kboRE73hUkr0iitQAg4ovLNrgkVixuBfaU8Iahm9mozVXJM7Sd6B7QhNB5nO6VvVWOoA6oaeBtbn9tA0Z10hTXAEwQjTg4oOmyeMOrRq5YCn4SJ+t3BO4XSAQyd4cwIeZBXOR3AqwszgMaYzMwe0NZi3fMGxv0bqq61vvkKpGPs/Q29+8ABrwNgOgwndXqMM9nLo2VUTHmiLsYIvBsEkPHIqIP37YTjihtbilu7Lws0iOBXgkEb0BtLgtAuXBjgU4ZZGfJClky/hWFJTVCl5j7XCtyy/ZjuQO4C5qbOJeWc9PTa94AOpdstD/OwFAtjV+KSNELnpO8Mhk3RNUwU0MoFPWJrw9/az9Hu8Rp8scQ1rrRP8oUZ/AoIKL7QRdKmCrh74czOLeTIosDmBTGjjoCVL1h5sFtFyhaq/pEtSXIHjzGiZA7XZA6NWiy9ocgLaIVqDmEO3H3NAzjT9j+dczMrYGqrQtQJAO9SSzDrAf9z5lO4VAOesQpcMpgGfszLdK7CGa9WEFKHot8vGxsbGxkY/drs/Jqhm6W99KqUAAAAASUVORK5CYII=";
      loading.classList.add("loading");
      loading.innerText = "Loading";
      personalLoader.id = "personal-loader";
      if (theme) personalLoader.setAttribute("dark", true);
      personalLoader.appendChild(css);
      personalLoader.appendChild(img);
      personalLoader.appendChild(loading);
      document.body.appendChild(personalLoader);
      await delay(500);
      personalLoader.style.bottom = 0;
      let isSpawn = true;
      exit(async function () {
        if (!isSpawn) return !0;
        personalLoader.style.bottom = "-100%";
        await delay(500);
        personalLoader.parentNode.removeChild(personalLoader);
        isSpawn = false;
        return !0;
      });
    });
  }
});
