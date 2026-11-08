const BRANCH_DATA_URL = "data/stores.json";

const pinIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"></path>
    <circle cx="12" cy="10" r="2.5"></circle>
  </svg>`;

const phoneIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.6 2.8 9.5 2l2.1 5-2.1 1.8a15 15 0 0 0 5.7 5.7l1.8-2.1 5 2.1-.8 2.9a3 3 0 0 1-3.2 2.2A17.5 17.5 0 0 1 4.4 6a3 3 0 0 1 2.2-3.2Z"></path>
  </svg>`;

const directionIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m12 3 9 9-9 9-9-9 9-9Z"></path>
    <path d="M8.5 12h7m-3-3 3 3-3 3"></path>
  </svg>`;

function createStoreCard(store) {
  const card = document.createElement("article");
  card.className = "store-card";

  const info = document.createElement("div");
  info.className = "store-card__name";

  if (store.open24h) {
    const badge = document.createElement("span");
    badge.className = "open-badge";
    badge.textContent = "24H 營業";
    info.append(badge);
  }

  const name = document.createElement("h3");
  name.textContent = store.name;
  info.append(name);

  const details = document.createElement("div");
  details.className = "store-card__details";

  const address = document.createElement("p");
  address.className = "store-card__line";
  address.innerHTML = `<span class="store-card__icon">${pinIcon}</span>`;
  const addressText = document.createElement("span");
  addressText.className = "store-card__text";
  addressText.textContent = store.address;
  address.append(addressText);
  details.append(address);

  if (store.phone) {
    const phone = document.createElement("p");
    phone.className = "store-card__line store-card__phone";
    phone.innerHTML = `<span class="store-card__icon">${phoneIcon}</span>`;
    const phoneText = document.createElement("a");
    phoneText.className = "store-card__text";
    phoneText.href = `tel:${store.phone.replaceAll("-", "")}`;
    phoneText.textContent = `門市專線：${store.phone}`;
    phone.append(phoneText);
    details.append(phone);
  }

  const mapLink = document.createElement("a");
  mapLink.className = "map-button";
  mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;
  mapLink.target = "_blank";
  mapLink.rel = "noopener noreferrer";
  mapLink.innerHTML = `<span class="map-button__icon">${directionIcon}</span><span>導航到店</span>`;
  mapLink.setAttribute("aria-label", `開啟${store.name}地圖導航`);

  card.append(info, details, mapLink);
  return card;
}

function renderBranches(regions) {
  const root = document.querySelector("#branch-list");
  root.replaceChildren();

  regions.forEach((region) => {
    const section = document.createElement("section");
    section.className = "region";

    const heading = document.createElement("h2");
    heading.className = "region__title";

    const regionName = document.createElement("span");
    regionName.textContent = region.name;

    const count = document.createElement("small");
    count.textContent = `（${region.stores.length} 間門市）`;

    heading.append(regionName, count);

    const list = document.createElement("div");
    list.className = "region__stores";
    region.stores.forEach((store) => list.append(createStoreCard(store)));

    section.append(heading, list);
    root.append(section);
  });
}

async function initBranches() {
  const root = document.querySelector("#branch-list");
  try {
    const response = await fetch(BRANCH_DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const regions = await response.json();
    renderBranches(regions);
  } catch (error) {
    console.error("無法載入分店資料：", error);
    root.innerHTML = '<p class="branch-error">目前無法載入分店資料，請稍後再試。</p>';
  }
}

initBranches();
