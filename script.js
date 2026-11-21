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

const FIREBASE_DB_URL = "https://console.firebase.google.com/project/project-5407213371933536326/database/project-5407213371933536326-default-rtdb/data/~2F";

let currentUserId = localStorage.getItem("sandBreakoutUserId");
if (!currentUserId) {
  currentUserId = "user_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
  localStorage.setItem("sandBreakoutUserId", currentUserId);
}

let allReviews = [];
let selectedStars = 5;
let editingReviewId = null;
let currentUploadedPhotos = [];

async function loadAllReviews() {
  if (FIREBASE_DB_URL) {
    try {
      const res = await fetch(`${FIREBASE_DB_URL}reviews.json`);
      const data = await res.json();
      if (data && typeof data === "object") {
        allReviews = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(item => item && item.name && item.litter && item.content)
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      } else {
        allReviews = [];
      }
      renderReviews();
      return;
    } catch (err) {
      allReviews = [];
    }
  }
  const savedLocal = JSON.parse(localStorage.getItem("sandBreakoutReviews_v4")) || [];
  allReviews = savedLocal.filter(item => item && item.name && item.litter && item.content);
  renderReviews();
}

function saveLocalFallback() {
  try {
    localStorage.setItem("sandBreakoutReviews_v4", JSON.stringify(allReviews));
  } catch (e) {
    alert("本機暫存空間已滿！");
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

let cropFileQueue = [];
let activeCropImage = null;
let cropAspect = "square";
let cropScale = 1;
let cropOffsetX = 0;
let cropOffsetY = 0;
let isDraggingCrop = false;
let dragStartX = 0;
let dragStartY = 0;

const cropModal = document.getElementById("photo-crop-modal");
const cropCanvas = document.getElementById("crop-canvas");
const cropCtx = cropCanvas ? cropCanvas.getContext("2d") : null;
const cropZoomSlider = document.getElementById("crop-zoom-slider");
const ratioSquareBtn = document.getElementById("ratio-square-btn");
const ratioLandscapeBtn = document.getElementById("ratio-landscape-btn");

function setCropAspect(mode) {
  cropAspect = mode;
  if (mode === "square") {
    cropCanvas.width = 280;
    cropCanvas.height = 280;
    ratioSquareBtn.className = "px-3 py-1 rounded-lg text-xs font-black bg-[#F4B860] text-[#4A3B32] border border-[#D9822B]";
    ratioLandscapeBtn.className = "px-3 py-1 rounded-lg text-xs font-bold bg-[#FDF8EE] text-[#7D6658] border border-[#EBDCCB]";
  } else {
    cropCanvas.width = 300;
    cropCanvas.height = 225;
    ratioLandscapeBtn.className = "px-3 py-1 rounded-lg text-xs font-black bg-[#F4B860] text-[#4A3B32] border border-[#D9822B]";
    ratioSquareBtn.className = "px-3 py-1 rounded-lg text-xs font-bold bg-[#FDF8EE] text-[#7D6658] border border-[#EBDCCB]";
  }
  resetCropTransform();
  drawCropCanvas();
}

function resetCropTransform() {
  if (!activeCropImage || !cropCanvas) return;
  const scaleX = cropCanvas.width / activeCropImage.width;
  const scaleY = cropCanvas.height / activeCropImage.height;
  cropScale = Math.max(scaleX, scaleY);
  cropZoomSlider.min = (cropScale * 0.6).toFixed(2);
  cropZoomSlider.max = (cropScale * 3.5).toFixed(2);
  cropZoomSlider.value = cropScale.toFixed(2);
  cropOffsetX = (cropCanvas.width - activeCropImage.width * cropScale) / 2;
  cropOffsetY = (cropCanvas.height - activeCropImage.height * cropScale) / 2;
}

function drawCropCanvas() {
  if (!cropCtx || !activeCropImage) return;
  cropCtx.fillStyle = "#FDF8EE";
  cropCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);
  cropCtx.drawImage(
    activeCropImage,
    cropOffsetX,
    cropOffsetY,
    activeCropImage.width * cropScale,
    activeCropImage.height * cropScale
  );
}

function processNextCropInQueue() {
  if (cropFileQueue.length === 0 || currentUploadedPhotos.length >= 4) {
    cropModal.classList.add("hidden");
    cropModal.classList.remove("flex");
    activeCropImage = null;
    renderUploadedPhotosPreview();
    return;
  }

  const nextFile = cropFileQueue.shift();
  const remaining = cropFileQueue.length + 1;
  document.getElementById("crop-queue-indicator").textContent = `待裁切：還有 ${remaining} 張`;

  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      activeCropImage = img;
      cropModal.classList.remove("hidden");
      cropModal.classList.add("flex");
      setCropAspect(cropAspect);
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(nextFile);
}

ratioSquareBtn?.addEventListener("click", () => setCropAspect("square"));
ratioLandscapeBtn?.addEventListener("click", () => setCropAspect("landscape"));

cropZoomSlider?.addEventListener("input", e => {
  if (!activeCropImage) return;
  const newScale = parseFloat(e.target.value);
  const centerX = cropCanvas.width / 2;
  const centerY = cropCanvas.height / 2;
  cropOffsetX = centerX - ((centerX - cropOffsetX) / cropScale) * newScale;
  cropOffsetY = centerY - ((centerY - cropOffsetY) / cropScale) * newScale;
  cropScale = newScale;
  drawCropCanvas();
});

if (cropCanvas) {
  cropCanvas.addEventListener("pointerdown", e => {
    isDraggingCrop = true;
    dragStartX = e.clientX - cropOffsetX;
    dragStartY = e.clientY - cropOffsetY;
    cropCanvas.setPointerCapture(e.pointerId);
  });
  cropCanvas.addEventListener("pointermove", e => {
    if (!isDraggingCrop) return;
    cropOffsetX = e.clientX - dragStartX;
    cropOffsetY = e.clientY - dragStartY;
    drawCropCanvas();
  });
  cropCanvas.addEventListener("pointerup", () => { isDraggingCrop = false; });
}

document.getElementById("confirm-crop-btn")?.addEventListener("click", () => {
  if (!cropCanvas) return;
  const outCanvas = document.createElement("canvas");
  const targetW = cropAspect === "square" ? 560 : 640;
  const targetH = cropAspect === "square" ? 560 : 480;
  outCanvas.width = targetW;
  outCanvas.height = targetH;
  outCanvas.getContext("2d").drawImage(cropCanvas, 0, 0, targetW, targetH);

  const croppedDataUrl = outCanvas.toDataURL("image/jpeg", 0.82);
  currentUploadedPhotos.push(croppedDataUrl);
  processNextCropInQueue();
});

document.getElementById("cancel-crop-btn")?.addEventListener("click", () => {
  processNextCropInQueue();
});

const photoInput = document.getElementById("cat-photo-input");
if (photoInput) {
  photoInput.addEventListener("change", e => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const availableSlots = 4 - currentUploadedPhotos.length;
    if (availableSlots <= 0) {
      alert("每則留言最多可上傳 4 張照片喔！");
      photoInput.value = "";
      return;
    }

    if (files.length > availableSlots) {
      alert(`目前還能再上傳 ${availableSlots} 張照片，系統將自動載入前 ${availableSlots} 張進行裁切。`);
    }

    cropFileQueue = files.slice(0, availableSlots);
    photoInput.value = "";
    processNextCropInQueue();
  });
}

function renderUploadedPhotosPreview() {
  const grid = document.getElementById("cat-photos-preview-grid");
  if (!grid) return;

  if (currentUploadedPhotos.length === 0) {
    grid.classList.add("hidden");
    grid.innerHTML = "";
    return;
  }

  grid.classList.remove("hidden");
  grid.innerHTML = currentUploadedPhotos.map((src, idx) => `
    <div class="relative group rounded-2xl overflow-hidden border-2 border-[#F4B860] bg-[#FFFDF9] aspect-square">
      <img src="${src}" alt="已裁切照片 ${idx + 1}" class="w-full h-full object-cover">
      <button type="button" onclick="removeUploadedPhoto(${idx})" class="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#C53030] text-white text-xs font-black flex items-center justify-center shadow-sm hover:scale-105 transition">
        ✕
      </button>
      <span class="absolute bottom-1 left-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
        第 ${idx + 1} 張
      </span>
    </div>
  `).join("");
}

window.removeUploadedPhoto = function(idx) {
  currentUploadedPhotos.splice(idx, 1);
  renderUploadedPhotosPreview();
};

function buildPhotoGalleryHtml(photos, authorName) {
  if (!photos || photos.length === 0) return "";
  const count = photos.length;

  const imgTag = (src, extraClass = "h-48") => `
    <div class="overflow-hidden bg-[#FDF8EE] cursor-zoom-in relative group ${extraClass}" onclick="openPhotoLightbox('${src}')">
      <img src="${src}" alt="${authorName}的貓咪" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
    </div>
  `;

  if (count === 1) {
    return `<div class="mb-3.5 rounded-2xl overflow-hidden border border-[#EBDCCB]">${imgTag(photos[0], "h-56")}</div>`;
  }
  if (count === 2) {
    return `<div class="mb-3.5 rounded-2xl overflow-hidden border border-[#EBDCCB] grid grid-cols-2 gap-1">${imgTag(photos[0], "h-44")}${imgTag(photos[1], "h-44")}</div>`;
  }
  if (count === 3) {
    return `
      <div class="mb-3.5 rounded-2xl overflow-hidden border border-[#EBDCCB] grid grid-cols-2 gap-1">
        ${imgTag(photos[0], "col-span-2 h-44")}
        ${imgTag(photos[1], "h-32")}
        ${imgTag(photos[2], "h-32")}
      </div>
    `;
  }
  return `
    <div class="mb-3.5 rounded-2xl overflow-hidden border border-[#EBDCCB] grid grid-cols-2 gap-1">
      ${photos.slice(0, 4).map(src => imgTag(src, "h-32")).join("")}
    </div>
  `;
}

window.openPhotoLightbox = function(src) {
  const modal = document.getElementById("photo-lightbox-modal");
  const img = document.getElementById("lightbox-img");
  if (modal && img) {
    img.src = src;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
};

window.closePhotoLightbox = function() {
  const modal = document.getElementById("photo-lightbox-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
};

function renderReviews() {
  const listEl = document.getElementById("review-list");
  if (!listEl) return;

  if (allReviews.length === 0) {
    listEl.innerHTML = `
      <div class="col-span-full text-center py-12 bg-[#FFFDF9] border-2 border-dashed border-[#EBDCCB] rounded-3xl px-4">
        <div class="text-4xl mb-2">🐾</div>
        <p class="font-black text-lg text-[#4A3B32] mb-1">目前還沒有飼主留言喔！</p>
        <p class="text-sm text-[#7D6658]">成為第一位推薦愛用環保貓砂並曬出主子美照的飼主吧～</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = allReviews.map((rev, index) => {
    const isMyReview = rev.authorId === currentUserId;
    const photosArray = Array.isArray(rev.photos) ? rev.photos : (rev.catPhoto ? [rev.catPhoto] : []);
    const galleryHtml = buildPhotoGalleryHtml(photosArray, rev.name);

    const footerHtml = isMyReview
      ? `<div class="pt-3 border-t border-[#EBDCCB] flex items-center justify-between text-xs font-bold"><span class="text-[#D9822B]">👤 我的推薦</span><div class="flex gap-2"><button type="button" onclick="editReview(${index})" class="px-3 py-1 rounded-lg bg-[#F7EAD8] text-[#4A3B32] hover:bg-[#F4B860] transition">✏️ 編輯</button><button type="button" onclick="deleteReview(${index})" class="px-3 py-1 rounded-lg bg-[#FDE8E8] text-[#C53030] hover:bg-[#FEB2B2] transition">🗑️ 刪除</button></div></div>`
      : `<div class="pt-3 border-t border-[#EBDCCB] flex items-center justify-between text-xs text-[#7D6658]"><span>🌿 環保貓砂同好推薦</span></div>`;

    return `
      <div class="bg-[#FFFDF9] border-2 ${isMyReview ? "border-[#F4B860]" : "border-[#EBDCCB]"} rounded-3xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          ${galleryHtml}
          <div class="flex items-center justify-between mb-2">
            <span class="font-black text-base text-[#4A3B32]">🐾 ${rev.name}</span>
            <span class="text-sm">${"⭐".repeat(rev.stars || 5)}</span>
          </div>
          <div class="inline-block bg-[#E5F3E6] text-[#2F6B36] text-xs font-bold px-3 py-1 rounded-lg mb-3">
            👍 推薦貓砂：${rev.litter}
          </div>
          <p class="text-sm text-[#4A3B32] leading-relaxed mb-4 whitespace-pre-line">${rev.content}</p>
        </div>
        ${footerHtml}
      </div>
    `;
  }).join("");
}

window.editReview = function(index) {
  const target = allReviews[index];
  if (!target || target.authorId !== currentUserId) return;
  editingReviewId = target.id || index;
  document.getElementById("reviewer-name").value = target.name;
  document.getElementById("review-litter-name").value = target.litter;
  document.getElementById("review-content").value = target.content;
  updateStarUI(target.stars || 5);

  currentUploadedPhotos = Array.isArray(target.photos) ? [...target.photos] : (target.catPhoto ? [target.catPhoto] : []);
  renderUploadedPhotosPreview();

  document.getElementById("submit-review-btn").textContent = "💾 儲存修改內容";
  document.getElementById("review-form").scrollIntoView({ behavior: "smooth", block: "center" });
};

window.deleteReview = async function(index) {
  const target = allReviews[index];
  if (!target || target.authorId !== currentUserId) return;
  if (!confirm("確定要刪除你發布的這則推薦嗎？")) return;

  if (FIREBASE_DB_URL && target.id) {
    await fetch(`${FIREBASE_DB_URL}reviews/${target.id}.json`, { method: "DELETE" });
    await loadAllReviews();
  } else {
    allReviews.splice(index, 1);
    saveLocalFallback();
    renderReviews();
  }
  if (editingReviewId !== null) resetReviewForm();
};

function resetReviewForm() {
  editingReviewId = null;
  document.getElementById("review-form").reset();
  updateStarUI(5);
  currentUploadedPhotos = [];
  renderUploadedPhotosPreview();
  document.getElementById("submit-review-btn").textContent = "送出推薦貼上心得牆";
}

document.querySelectorAll("#star-selector span").forEach(starEl => {
  starEl.addEventListener("click", () => updateStarUI(parseInt(starEl.getAttribute("data-star"), 10)));
});

const reviewForm = document.getElementById("review-form");
if (reviewForm) {
  reviewForm.addEventListener("submit", async e => {
    e.preventDefault();
    const name = document.getElementById("reviewer-name").value.trim();
    const litter = document.getElementById("review-litter-name").value.trim();
    const content = document.getElementById("review-content").value.trim();
    if (!name || !litter || !content) return;

    const submitBtn = document.getElementById("submit-review-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "正在上傳發布中...";

    const reviewPayload = {
      authorId: currentUserId,
      name,
      litter,
      stars: selectedStars,
      content,
      photos: currentUploadedPhotos,
      createdAt: Date.now()
    };

    if (FIREBASE_DB_URL) {
      try {
        if (editingReviewId && typeof editingReviewId === "string") {
          await fetch(`${FIREBASE_DB_URL}reviews/${editingReviewId}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reviewPayload)
          });
        } else {
          await fetch(`${FIREBASE_DB_URL}reviews.json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reviewPayload)
          });
        }
        await loadAllReviews();
      } catch (err) {
        alert("雲端上傳發生錯誤，請檢查網路或資料庫權限！");
      }
    } else {
      if (editingReviewId !== null && typeof editingReviewId === "number") {
        allReviews[editingReviewId] = reviewPayload;
      } else {
        allReviews.unshift(reviewPayload);
      }
      saveLocalFallback();
      renderReviews();
    }

    submitBtn.disabled = false;
    resetReviewForm();
  });
}

loadAllReviews();

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