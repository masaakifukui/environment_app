// ------------------------------
// index.html 用 RSSフィード処理
// ------------------------------
if (document.body.contains(document.getElementById("feed-a"))) {
    const rssFeeds = [
        {
            name: '水質汚染',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.google.co.jp/alerts/feeds/11818790637394781868/5730743916708813572',
            targetId: 'feed-a'
        },
        {
            name: '温暖化',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.google.co.jp/alerts/feeds/11818790637394781868/5685444894200799844',
            targetId: 'feed-b'
        },
        {
            name: '土壌汚染',
            url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.google.co.jp/alerts/feeds/11818790637394781868/16051316454223707398',
            targetId: 'feed-c'
        }
    ];

    rssFeeds.forEach(feed => {
        fetch(feed.url)
            .then(res => res.json())
            .then(data => {
                let html = '';
                const items = data.items.slice(0, 3);
                items.forEach(item => {
                    console.log(item)
                    html += `
                      <li class="rss-list">
                        <a href="${item.link}" target="_blank"><strong>${item.title}</strong></a><br>
                        <p>${item.description}</p>
                      </li>
                    `;
                });
                document.getElementById(feed.targetId).innerHTML = html;
            })
            .catch(error => {
                console.error(`Feed "${feed.name}" の読み込みエラー:`, error);
                document.getElementById(feed.targetId).innerHTML = '<li>読み込みに失敗しました。</li>';
            });
    });
}

// ------------------------------
// search.html 用 検索処理
// ------------------------------
if (document.getElementById("search-form")) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");         // キーワード検索
    const form = document.getElementById("search-form");
    const input = form.querySelector("input[name='q']");
    const resultsDiv = document.getElementById("results");

    let allData = [];

    function getCategoryFromUrlOrReferrer() {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryStr = urlParams.get("category");

        if (categoryStr && !isNaN(categoryStr)) {
            return Number(categoryStr);
        }

        const ref = document.referrer;
        if (ref) {
            try {
                const refUrl = new URL(ref);
                const refCategoryStr = new URLSearchParams(refUrl.search).get("category");
                if (refCategoryStr && !isNaN(refCategoryStr)) {
                    return Number(refCategoryStr);
                }
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    const categoryFromParamOrReferrer = Number(getCategoryFromUrlOrReferrer()) || null;

    function renderResults(data) {
        resultsDiv.innerHTML = "";

        if (data.length === 0) {
            resultsDiv.textContent = "一致する結果はありません。";
            return;
        }

        const ul = document.createElement("ul");
        data.forEach(item => {
            const li = document.createElement("li");
            li.className = "rss-list";
            li.innerHTML = `
              <a href="${item.link}" target="_blank"><strong>${item.title}</strong></a><br>
              <p>${item.content}</p>
            `;
            ul.appendChild(li);
        });
        resultsDiv.appendChild(ul);
    }

    function fetchAllData() {
        resultsDiv.textContent = "読み込み中...";
        const q = input.value.trim().toLowerCase();
        const apiString = `https://firstd1project.masaaki.workers.dev/?category=${categoryFromParamOrReferrer}&keyword=${q}`
        fetch("https://firstd1project.masaaki.workers.dev/?category={}")
            .then(res => res.json())
            .then(data => {
                allData = data;
                applyFilterAndRender();
            })
            .catch(() => {
                resultsDiv.textContent = "データの取得に失敗しました。";
            });
    }

    function applyFilterAndRender() {
        const q = input.value.trim().toLowerCase();

        const filtered = allData.filter(item => {
            const matchKeyword = q
                ? (item.title.toLowerCase().includes(q) || (item.description || "").toLowerCase().includes(q))
                : true;

            const matchCategory = categoryFromParamOrReferrer !== null
                ? Number(item.category) === categoryFromParamOrReferrer
                : true;

            return matchKeyword && matchCategory;
        });

        renderResults(filtered);
    }

    window.addEventListener("DOMContentLoaded", () => {
        if (query) input.value = query;
        fetchAllData();
    });

    form.addEventListener("submit", e => {
        e.preventDefault();
        const qValue = input.value.trim();
        const params = new URLSearchParams(window.location.search);
        if (qValue) {
            params.set("q", qValue);
        } else {
            params.delete("q");
        }
        const newUrl = `${location.pathname}?${params.toString()}`.replace(/\?$/, "");
        window.history.replaceState({}, "", newUrl);
        applyFilterAndRender();
    });
}
