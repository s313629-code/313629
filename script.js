const litterProducts = [
  { name: "植萃仿礦極細豆腐砂", tag: "主子無痛轉砂首選", texture: "mineral", budget: "budget", box: "auto", desc: "採用食品級豆渣副產品製成，1.5mm 極細顆粒還原礦砂踩踏感，單層盆與自動貓砂機皆適用。", stats: "吸水力 ★★★★★ ｜ 低粉塵不飛揚" },
  { name: "天然松木崩解環保砂", tag: "多貓家庭高 CP 值", texture: "strip", budget: "budget", box: "open", desc: "回收木材加工木屑高壓製成，遇尿崩解成木粉並散發天然木質清香（需搭配雙層貓砂盆使用）。", stats: "除臭力 ★★★★★ ｜ 零化學香精" },
  { name: "活性碳低敏混合植物砂", tag: "高凝結力植物配方", texture: "mineral", budget: "premium", box: "auto", desc: "結合植物纖維與椰殼活性碳，遇水 2 秒緊實凝結不黏底，可生物分解（為保護管線建議裝袋丟一般垃圾）。", stats: "凝結力 ★★★★★ ｜ 可自然分解" },
  { name: "無塵再生紙纖環保砂", tag: "術後/呼吸道敏感貓推薦", texture: "strip", budget: "premium", box: "open", desc: "100% 再生紙漿製造，近乎零粉塵、不沾黏傷口，極輕量化設計讓倒砂與清理不再費力。", stats: "低粉塵 ★★★★★ ｜ 輕量好清理" },
  { name: "經典條狀原味豆腐砂", tag: "不易卡指縫帶出盆外", texture: "strip", budget: "budget", box: "open", desc: "加長型紮實條狀設計，大幅減少貓咪撥砂帶出盆外的困擾，維持居家地板乾淨。", stats: "低帶砂 ★★★★☆ ｜ 結團穩固" },
  { name: "農廢循環茶梗消臭砂", tag: "在地農業副產品再利用", texture: "mineral", budget: "premium", box: "open", desc: "運用製茶剩餘茶梗與豆渣結合，天然茶多酚抑菌除臭，實踐 SDGs 12 循環經濟。", stats: "除臭力 ★★★★★ ｜ 在地永續" }
];

const currentFilters = { texture: "all", budget: "all", box: "all" };

function renderLitterCards() {
  const container = document.getElementById("litter-cards");
  if (!container) return;

  const filtered = litterProducts.filter(item =>
    (currentFilters.texture === "all" || item.texture === currentFilters.texture) &&
    (currentFilters.budget === "all" || item.budget === currentFilters.budget) &&
    (currentFilters.box === "all" || item.box === currentFilters.box)
  );

  if (filtered.length === 0) {
    container.innerHTML = `<div class="col-span-3 text-center py-10 bg-[#FFFDF9] border-2 border-dashed border-[#EBDCCB] rounded-3xl"><p class="font-bold text-lg mb-2">😿 暫時沒有完全符合這三個條件的貓砂</p><p class="text-sm text-[#7D6658]">試著把其中一個條件切換回「全部」看看吧！</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="bg-[#FFFDF9] border-2 border-[#EBDCCB] rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-[#F4B860] transition">
      <div>
        <span class="inline-block bg-[#F7EAD8] text-[#7D6658] text-xs font-bold px-3 py-1 rounded-full mb-3">${item.tag}</span>
        <h3 class="text-lg font-black mb-2">${item.name}</h3>
        <p class="text-sm text-[#7D6658] leading-relaxed mb-4">${item.desc}</p>
      </div>
      <div class="pt-3 border-t border-[#EBDCCB] text-xs font-bold text-[#D9822B]">${item.stats}</div>
    </div>
  `).join("");
}

document.querySelectorAll("[data-filter-group]").forEach(group => {
  const groupName = group.getAttribute("data-filter-group");
  group.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      group.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilters[groupName] = btn.getAttribute("data-value");
      renderLitterCards();
    });
  });
});
renderLitterCards();

const catCountInput = document.getElementById("cat-count");
const litterSelect = document.getElementById("current-litter");

function updateSustainabilityCalc() {
  if (!catCountInput || !litterSelect) return;
  const cats = parseInt(catCountInput.value, 10);
  const factor = parseFloat(litterSelect.value);
  document.getElementById("cat-count-display").textContent = cats;
  const wasteSaved = Math.round(cats * 48 * factor);
  const treesSaved = Math.max(1, Math.round(wasteSaved / 12));
  document.getElementById("waste-saved").textContent = wasteSaved;
  document.getElementById("trees-saved").textContent = treesSaved;
}

if (catCountInput && litterSelect) {
  catCountInput.addEventListener("input", updateSustainabilityCalc);
  litterSelect.addEventListener("change", updateSustainabilityCalc);
  updateSustainabilityCalc();
}

let currentUserId = localStorage.getItem("sandBreakoutUserId");
if (!currentUserId) {
  currentUserId = "user_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
  localStorage.setItem("sandBreakoutUserId", currentUserId);
}

let initialReviews = JSON.parse(localStorage.getItem("sandBreakoutReviews_v2")) || [];
let selectedStars = 5;
let editingIndex = -1;
let uploadedCatPhotoDataUrl = "";

function saveReviewsToStorage() {
  try {
    localStorage.setItem("sandBreakoutReviews_v2", JSON.stringify(initialReviews));
  } catch (e) {
    alert("圖片檔案較大，已顯示於目前畫面中！");
  }
}

function updateStarUI(count) {
  selectedStars = count;
  const starText = document.getElementById("star-value-text");
  if (starText) starText.textContent = "(" + selectedStars + " 分)";
  document.querySelectorAll("#star-selector span").forEach((s, idx) => {
    s.style.opacity = idx < selectedStars ? "1" : "0.3";
  });
}

const photoInput = document.getElementById("cat-photo-input");
const previewBox = document.getElementById("cat-photo-preview-box");
const previewImg = document.getElementById("cat-photo-preview-img");
const removePhotoBtn = document.getElementById("remove-cat-photo-btn");

if (photoInput) {
  photoInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const tempImg = new Image();
      tempImg.onload = () => {
        const maxSide = 480;
        let w = tempImg.width;
        let h = tempImg.height;
        if (w > maxSide || h > maxSide) {
          if (w > h) { h = Math.round((h * maxSide) / w); w = maxSide; }
          else { w = Math.round((w * maxSide) / h); h = maxSide; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(tempImg, 0, 0, w, h);
        uploadedCatPhotoDataUrl = canvas.toDataURL("image/jpeg", 0.82);

        previewImg.src = uploadedCatPhotoDataUrl;
        previewBox.classList.remove("hidden");
      };
      tempImg.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

if (removePhotoBtn) {
  removePhotoBtn.addEventListener("click", () => {
    uploadedCatPhotoDataUrl = "";
    photoInput.value = "";
    previewImg.src = "";
    previewBox.classList.add("hidden");
  });
}

function renderReviews() {
  const listEl = document.getElementById("review-list");
  if (!listEl) return;

  if (initialReviews.length === 0) {
    listEl.innerHTML = `
      <div class="col-span-3 text-center py-12 bg-[#FFFDF9] border-2 border-dashed border-[#EBDCCB] rounded-3xl px-4">
        <div class="text-4xl mb-2">🐾</div>
        <p class="font-black text-lg text-[#4A3B32] mb-1">目前還沒有飼主留言喔！</p>
        <p class="text-sm text-[#7D6658]">成為第一位推薦環保貓砂並曬出自家主子萌照的飼主吧～</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = initialReviews.map((rev, index) => {
    const isMyReview = rev.authorId === currentUserId;
    const photoHtml = rev.catPhoto
      ? `<div class="mb-3 rounded-2xl overflow-hidden border border-[#EBDCCB] bg-[#FDF8EE] h-48"><img src="${rev.catPhoto}" alt="${rev.name}的貓咪" class="w-full h-full object-cover"></div>`
      : "";

    const footerHtml = isMyReview
      ? `<div class="pt-3 border-t border-[#EBDCCB] flex items-center justify-between text-xs font-bold"><span class="text-[#D9822B]">👤 我的推薦</span><div class="flex gap-2"><button type="button" onclick="editReview(${index})" class="px-3 py-1 rounded-lg bg-[#F7EAD8] text-[#4A3B32] hover:bg-[#F4B860] transition">✏️ 編輯</button><button type="button" onclick="deleteReview(${index})" class="px-3 py-1 rounded-lg bg-[#FDE8E8] text-[#C53030] hover:bg-[#FEB2B2] transition">🗑️ 刪除</button></div></div>`
      : `<div class="pt-3 border-t border-[#EBDCCB] flex items-center justify-between text-xs text-[#7D6658]"><span>🌿 環保貓砂同好分享</span></div>`;

    return `
      <div class="bg-[#FFFDF9] border-2 ${isMyReview ? "border-[#F4B860]" : "border-[#EBDCCB]"} rounded-3xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          ${photoHtml}
          <div class="flex items-center justify-between mb-2">
            <span class="font-black text-base">🐾 ${rev.name}</span>
            <span class="text-sm">${"⭐".repeat(rev.stars)}</span>
          </div>
          <div class="inline-block bg-[#E5F3E6] text-[#2F6B36] text-xs font-bold px-2.5 py-1 rounded-lg mb-3">
            👍 推薦類型：${rev.litter}
          </div>
          <p class="text-sm text-[#4A3B32] leading-relaxed mb-4">${rev.content}</p>
        </div>
        ${footerHtml}
      </div>
    `;
  }).join("");
}

window.editReview = function(index) {
  const target = initialReviews[index];
  if (target.authorId !== currentUserId) return;
  editingIndex = index;
  document.getElementById("reviewer-name").value = target.name;
  document.getElementById("review-litter-type").value = target.litter;
  document.getElementById("review-content").value = target.content;
  updateStarUI(target.stars);

  uploadedCatPhotoDataUrl = target.catPhoto || "";
  if (uploadedCatPhotoDataUrl) {
    previewImg.src = uploadedCatPhotoDataUrl;
    previewBox.classList.remove("hidden");
  } else {
    previewBox.classList.add("hidden");
  }

  document.querySelector("#review-form button[type='submit']").textContent = "💾 儲存修改內容";
  document.getElementById("review-form").scrollIntoView({ behavior: "smooth", block: "center" });
};

window.deleteReview = function(index) {
  const target = initialReviews[index];
  if (target.authorId !== currentUserId) return;
  if (confirm("確定要刪除你發布的這則推薦嗎？")) {
    initialReviews.splice(index, 1);
    saveReviewsToStorage();
    renderReviews();
    if (editingIndex === index) resetReviewForm();
  }
};

function resetReviewForm() {
  editingIndex = -1;
  document.getElementById("review-form").reset();
  updateStarUI(5);
  uploadedCatPhotoDataUrl = "";
  previewImg.src = "";
  previewBox.classList.add("hidden");
  document.querySelector("#review-form button[type='submit']").textContent = "送出推薦貼上心得牆";
}

document.querySelectorAll("#star-selector span").forEach(starEl => {
  starEl.addEventListener("click", () => updateStarUI(parseInt(starEl.getAttribute("data-star"), 10)));
});

const reviewForm = document.getElementById("review-form");
if (reviewForm) {
  reviewForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("reviewer-name").value.trim();
    const litter = document.getElementById("review-litter-type").value;
    const content = document.getElementById("review-content").value.trim();
    if (!name || !content) return;

    const reviewObj = {
      authorId: currentUserId,
      name,
      litter,
      stars: selectedStars,
      content,
      catPhoto: uploadedCatPhotoDataUrl
    };

    if (editingIndex >= 0 && initialReviews[editingIndex].authorId === currentUserId) {
      initialReviews[editingIndex] = reviewObj;
    } else {
      initialReviews.unshift(reviewObj);
    }
    saveReviewsToStorage();
    renderReviews();
    resetReviewForm();
  });
}
renderReviews();

const hexClipStyle = "-webkit-clip-path: polygon(22% 0%, 78% 0%, 100% 18%, 100% 100%, 0% 100%, 0% 18%); clip-path: polygon(22% 0%, 78% 0%, 100% 18%, 100% 100%, 0% 100%, 0% 18%);";

function buildOmamoriCardHtml(bgColor, ribbonColor, ribbonText, catImgSrc, line1, line2, isCat1 = false) {
  const imgHtml = isCat1
    ? `<div class="w-20 h-20 rounded-full overflow-hidden border-2 border-[#4A3B32] shadow-xs bg-[#262626] flex items-center justify-center"><img src="${catImgSrc}" alt="貓咪御守" class="w-full h-full object-cover"></div>`
    : `<img src="${catImgSrc}" alt="貓咪御守" class="w-22 h-22 object-contain cat-transparent-white" style="width:88px;height:88px;">`;

  return `
    <div class="flex flex-col items-center">
      <svg class="w-20 h-10 -mb-2 relative z-10" viewBox="0 0 120 60" fill="none">
        <path d="M48 24 C48 6, 72 6, 72 24" stroke="#C84B31" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M60 28 C38 14, 24 25, 38 35 C46 40, 56 32, 60 28 Z" fill="#E05A47" stroke="#4A3B32" stroke-width="2.2"/>
        <path d="M60 28 C82 14, 96 25, 82 35 C74 40, 64 32, 60 28 Z" fill="#E05A47" stroke="#4A3B32" stroke-width="2.2"/>
        <path d="M54 32 Q40 48 34 56" stroke="#C84B31" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M66 32 Q80 48 86 56" stroke="#C84B31" stroke-width="3.2" stroke-linecap="round"/>
        <rect x="53" y="22" width="14" height="11" rx="3" fill="#F4B860" stroke="#4A3B32" stroke-width="2"/>
      </svg>

      <div style="background-color: ${ribbonColor}; ${hexClipStyle}" class="w-40 h-56 p-1.5 shadow-md">
        <div style="background-color: ${bgColor}; ${hexClipStyle}" class="w-full h-full flex flex-col items-center justify-between pt-4 pb-3.5 px-2.5">
          <div style="background-color: ${ribbonColor};" class="text-white text-xs font-black tracking-widest px-3.5 py-0.5 rounded-full shadow-xs">${ribbonText}</div>
          <div class="w-24 h-24 flex items-center justify-center">
            ${imgHtml}
          </div>
          <div class="text-center leading-tight">
            <div class="font-black text-lg tracking-widest text-[#4A3B32]">${line1}</div>
            ${line2 ? `<div class="text-[11px] font-bold text-[#7D6658] mt-0.5">${line2}</div>` : ""}
          </div>
        </div>
      </div>
    </div>
  `;
}

const initialVisualEl = document.getElementById("omamori-visual");
if (initialVisualEl) {
  initialVisualEl.innerHTML = `
    <div class="flex flex-col items-center">
      <svg class="w-20 h-10 -mb-2 relative z-10" viewBox="0 0 120 60" fill="none">
        <path d="M48 24 C48 6, 72 6, 72 24" stroke="#C84B31" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M60 28 C38 14, 24 25, 38 35 C46 40, 56 32, 60 28 Z" fill="#E05A47" stroke="#4A3B32" stroke-width="2.2"/>
        <path d="M60 28 C82 14, 96 25, 82 35 C74 40, 64 32, 60 28 Z" fill="#E05A47" stroke="#4A3B32" stroke-width="2.2"/>
        <path d="M54 32 Q40 48 34 56" stroke="#C84B31" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M66 32 Q80 48 86 56" stroke="#C84B31" stroke-width="3.2" stroke-linecap="round"/>
        <rect x="53" y="22" width="14" height="11" rx="3" fill="#F4B860" stroke="#4A3B32" stroke-width="2"/>
      </svg>
      <div style="background-color: #8B5E3C; ${hexClipStyle}" class="w-40 h-56 p-1.5 shadow-md">
        <div style="background-color: #F7EAD8; ${hexClipStyle}" class="w-full h-full flex flex-col items-center justify-between pt-4 pb-3.5 px-2.5">
          <div style="background-color: #8B5E3C;" class="text-white text-xs font-black tracking-widest px-3.5 py-0.5 rounded-full shadow-xs">神秘御守</div>
          <div class="w-20 h-20 rounded-full bg-[#FFFDF9] border-2 border-dashed border-[#D9822B] flex items-center justify-center text-4xl font-black text-[#D9822B]">
            ？
          </div>
          <div class="text-center leading-tight">
            <div class="font-black text-base tracking-widest text-[#4A3B32]">尚未求籤</div>
            <div class="text-[11px] font-bold text-[#7D6658] mt-0.5">點擊下方抽取</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

const omamoriList = [
  { badge: "💚 守護健康 · 大吉", title: "健康平安守", bgColor: "#E5F3E6", ribbonColor: "#2F6B36", word1: "健康平安", catImg: "images/cat1.png", isCat1: true, blessing: "祝福主子天天大口吃飯、順暢上廁所，遠離泌尿道與呼吸道煩惱！", tip: "環保小語：低粉塵環保貓砂能保護貓咪與飼主的呼吸道健康喔。" },
  { badge: "🌍 地球永續 · 上上吉", title: "綠色永續守", bgColor: "#F7EAD8", ribbonColor: "#D9822B", word1: "地球永續", catImg: "images/cat2.png", isCat1: false, blessing: "感謝你為地球減少一份垃圾負擔，每一次鏟屎都是愛地球的表現！", tip: "環保小語：使用植物副產品貓砂，實踐 SDGs 12 責任消費與生產。" },
  { badge: "💰 招財進寶 · 大吉", title: "貓肥家潤守", bgColor: "#FEF3C7", ribbonColor: "#B45309", word1: "貓肥家潤", catImg: "images/cat3.png", isCat1: false, blessing: "省荷包又愛地球！祝福主子吃得圓滾滾、鏟屎官財運旺旺罐罐買不完！", tip: "環保小語：高吸水率環保貓砂用量更省，搭配密封防潮保存更耐用。" },
  { badge: "✨ 鏟屎順利 · 吉", title: "鏟屎順心守", bgColor: "#EBF4FF", ribbonColor: "#2B6CB0", word1: "鏟屎順心", catImg: "images/cat4.png", isCat1: false, blessing: "祝福你每次鏟砂都完整成團不碎裂，居家永遠保持清新無異味！", tip: "環保小語：維持貓砂厚度 5～7 公分，凝結與除臭效果最理想。" },
  { badge: "⚡ 活力滿滿 · 上上吉", title: "活力元氣守", bgColor: "#FEF3C7", ribbonColor: "#92400E", word1: "活力元氣", catImg: "images/cat5.png", isCat1: false, blessing: "祝福主子每天精神飽滿、快樂奔跑，健康陪伴你度過每一天！", tip: "環保小語：天然木屑與植物纖維無化學刺激，讓貓咪如廁更自在。" },
  { badge: "🌬️ 清新無塵 · 上上吉", title: "清新無塵守", bgColor: "#CCFBF1", ribbonColor: "#0F766E", word1: "清新無塵", catImg: "images/cat6.png", isCat1: false, blessing: "祝福你家主子撥砂再大力也不起煙霧，人貓每天都能大口呼吸新鮮空氣！", tip: "環保小語：天然豆渣與紙纖貓砂近乎零粉塵，敏感體質貓咪最安心。" },
  { badge: "👑 乖巧滿分 · 大吉", title: "乖乖用砂守", bgColor: "#F3F4F6", ribbonColor: "#374151", word1: "乖乖用砂", catImg: "images/cat7.png", isCat1: false, blessing: "祝福無痛換砂一次成功！主子天天準時進貓砂盆報到，絕不亂尿在棉被上！", tip: "環保小語：換砂初期採用 1:1 舊砂混新砂，能幫助貓咪快速適應新腳感。" },
  { badge: "🌙 安穩好眠 · 吉", title: "一夜好眠守", bgColor: "#EDE9FE", ribbonColor: "#6D28D9", word1: "一夜好眠", catImg: "images/cat8.png", isCat1: false, blessing: "祝福主子晚上跟著你一起乖乖睡覺，半夜不開運動會，讓你一覺到天亮！", tip: "環保小語：睡前把貓砂盆清理乾淨，能讓主子心情放鬆、減少半夜焦慮喵叫。" },
  { badge: "❤️ 人貓共好 · 上上吉", title: "幸福相伴守", bgColor: "#FFE4E6", ribbonColor: "#E11D48", word1: "幸福相伴", catImg: "images/cat9.png", isCat1: false, blessing: "祝福主子天天對你翻肚肚撒嬌呼嚕，人貓一起健康快樂地陪伴彼此好多年！", tip: "環保小語：選擇天然無化學香精貓砂，守護貓咪敏銳的嗅覺與健康。" }
];

let omamoriPool = [];
function getNextBalancedOmamoriIndex() {
  if (omamoriPool.length === 0) {
    omamoriPool = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = omamoriPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [omamoriPool[i], omamoriPool[j]] = [omamoriPool[j], omamoriPool[i]];
    }
  }
  return omamoriPool.pop();
}

let isDrawingOmamori = false;
const resultModal = document.getElementById("omamori-result-modal");

function closeResultModal() {
  if (resultModal) {
    resultModal.classList.add("hidden");
    resultModal.classList.remove("flex");
  }
}

document.getElementById("close-result-modal-btn")?.addEventListener("click", closeResultModal);
document.getElementById("modal-confirm-btn")?.addEventListener("click", closeResultModal);

function copyCurrentOmamoriShare() {
  const title = document.getElementById("omamori-title").textContent;
  const blessing = document.getElementById("omamori-blessing").textContent;
  const shareText = "我在「砂出重圍」抽到了【" + title + "】！" + blessing;
  navigator.clipboard.writeText(shareText).then(() => alert("已複製御守祝福小語，可以貼上分享給朋友囉！\n\n" + shareText));
}

document.getElementById("copy-omamori-btn")?.addEventListener("click", copyCurrentOmamoriShare);
document.getElementById("modal-copy-btn")?.addEventListener("click", copyCurrentOmamoriShare);

const drawBtn = document.getElementById("draw-omamori-btn");
if (drawBtn) {
  drawBtn.addEventListener("click", () => {
    if (isDrawingOmamori) return;
    isDrawingOmamori = true;

    const overlay = document.getElementById("omamori-draw-overlay");
    const walkingCat = document.getElementById("walking-shrine-cat");
    const cylinderBox = document.getElementById("temple-cylinder-box");
    const fortuneStick = document.getElementById("popping-fortune-stick");
    const statusTitle = document.getElementById("shrine-status-title");
    const statusSub = document.getElementById("shrine-status-sub");

    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
    statusTitle.textContent = "小貓咪正緩緩走向籤筒...";
    statusSub.textContent = "虔誠祈求守護主子與地球的專屬御守中～";

    walkingCat.classList.remove("animate-shrine-walk");
    cylinderBox.classList.remove("animate-cylinder-shake");
    fortuneStick.classList.remove("animate-stick-pop");
    walkingCat.style.transform = "translateX(0px)";
    fortuneStick.style.opacity = "0";
    void walkingCat.offsetWidth;

    walkingCat.classList.add("animate-shrine-walk");

    setTimeout(() => {
      statusTitle.textContent = "沙沙沙～ 小貓正在搖籤筒抽靈籤！";
      statusSub.textContent = "好運御守馬上就要跳出來囉～";
      cylinderBox.classList.add("animate-cylinder-shake");
      fortuneStick.classList.add("animate-stick-pop");
    }, 1600);

    setTimeout(() => {
      overlay.classList.add("hidden");
      overlay.classList.remove("flex");

      const nextIdx = getNextBalancedOmamoriIndex();
      const selected = omamoriList[nextIdx];
      const omamoriHtml = buildOmamoriCardHtml(selected.bgColor, selected.ribbonColor, "御守", selected.catImg, selected.word1, "", selected.isCat1);

      const visualEl = document.getElementById("omamori-visual");
      visualEl.innerHTML = omamoriHtml;
      document.getElementById("omamori-badge").textContent = selected.badge;
      document.getElementById("omamori-title").textContent = selected.title;
      document.getElementById("omamori-blessing").textContent = selected.blessing;
      document.getElementById("omamori-tip").textContent = selected.tip;
      document.getElementById("copy-omamori-btn").classList.remove("hidden");

      document.getElementById("modal-omamori-badge").textContent = selected.badge;
      document.getElementById("modal-omamori-visual").innerHTML = omamoriHtml;
      document.getElementById("modal-omamori-title").textContent = selected.title;
      document.getElementById("modal-omamori-blessing").textContent = selected.blessing;
      document.getElementById("modal-omamori-tip").textContent = selected.tip;

      resultModal.classList.remove("hidden");
      resultModal.classList.add("flex");

      isDrawingOmamori = false;
    }, 3200);
  });
}

window.addEventListener("scroll", () => {
  const runningCat = document.getElementById("running-cat");
  const rollingYarn = document.getElementById("rolling-yarn");
  const yarnLine = document.getElementById("yarn-line");
  if (!runningCat || !rollingYarn || !yarnLine) return;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;

  const maxTrackWidth = window.innerWidth - 110;
  const catX = progress * maxTrackWidth;
  const yarnX = catX + 55;

  runningCat.style.left = catX + "px";
  rollingYarn.style.left = yarnX + "px";
  yarnLine.style.width = (yarnX + 12) + "px";
  rollingYarn.style.transform = `rotate(${scrollTop * 0.8}deg)`;

  const stepPhase = Math.sin(scrollTop * 0.08);
  const leg1 = document.getElementById("cat-leg-1");
  const leg2 = document.getElementById("cat-leg-2");
  if (leg1 && leg2) {
    leg1.setAttribute("x2", 32 + stepPhase * 8);
    leg2.setAttribute("x2", 63 - stepPhase * 8);
  }
  runningCat.style.transform = `translateY(${Math.abs(stepPhase) * -4}px)`;
});