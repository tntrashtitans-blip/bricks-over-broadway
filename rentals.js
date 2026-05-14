const rentals = [
  {
    title: "Bricks Over Broadway",
    type: "Broadway loft above Bella",
    tags: ["downtown", "bella", "family", "work"],
    sleeps: "Sleeps 4",
    details: ["Above Bella", "1 bedroom", "1 bathroom"],
    description: "The original Bricks Over Broadway downtown loft, right above Bella Restaurant and steps from Broadway dining, coffee, shops, and events.",
    image: "Assets/listings/bricks-over-broadway.webp",
    url: "https://stonehouserentals.holidayfuture.com/listings/131125",
    calendarUrl: "https://platform.hostaway.com/ical/Vsf5DNagAkFpbxGZDqav9CIU9de6vxBKOzbSu6yQEthuTwy0VoczjMi1pHllZ7BP/listings/131125.ics",
    calendarCacheUrl: "calendars/131125.ics",
    cta: "Book this loft"
  },
  {
    title: "Blue Bella",
    type: "Broadway apartment above Bella",
    tags: ["downtown", "bella", "work"],
    sleeps: "Sleeps 2",
    details: ["Above Bella", "1 bedroom", "1 bathroom"],
    description: "A clean, stylish king-bed apartment in the heart of downtown Maryville, with restaurants, shops, and the Greenbelt nearby.",
    image: "Assets/listings/adorable-loft-above-bella.webp",
    url: "https://stonehouserentals.holidayfuture.com/listings/326085",
    calendarUrl: "https://platform.hostaway.com/ical/Vsf5DNagAkFpbxGZDqav9CIU9de6vxBKOzbSu6yQEthuTwy0VoczjMi1pHllZ7BP/listings/326085.ics",
    calendarCacheUrl: "calendars/326085.ics",
    cta: "Book this apartment"
  },
  {
    title: "Perch Over Pistol Creek",
    type: "Broadway loft above Bella",
    tags: ["downtown", "bella", "work"],
    sleeps: "Sleeps 2",
    details: ["Above Bella", "1 bedroom", "1 bathroom"],
    description: "A modern studio loft over Bella Restaurant with a king bed, kitchen, secure coded access, and direct downtown walkability.",
    image: "Assets/listings/stylish-downtown-loft.webp",
    url: "https://stonehouserentals.holidayfuture.com/listings/326086",
    calendarUrl: "https://platform.hostaway.com/ical/Vsf5DNagAkFpbxGZDqav9CIU9de6vxBKOzbSu6yQEthuTwy0VoczjMi1pHllZ7BP/listings/326086.ics",
    calendarCacheUrl: "calendars/326086.ics",
    cta: "Book this loft"
  },
  {
    title: "Scot's Suite",
    type: "Broadway apartment above Bella",
    tags: ["downtown", "bella", "work"],
    sleeps: "Sleeps 2",
    details: ["Above Bella", "1 bedroom", "1 bathroom"],
    description: "A compact downtown loft for guests who want Broadway restaurants, Maryville College, and Smoky Mountain day trips within easy reach.",
    image: "Assets/listings/stylish-maryville-loft.webp",
    url: "https://stonehouserentals.holidayfuture.com/listings/316937",
    calendarUrl: "https://platform.hostaway.com/ical/Vsf5DNagAkFpbxGZDqav9CIU9de6vxBKOzbSu6yQEthuTwy0VoczjMi1pHllZ7BP/listings/316937.ics",
    calendarCacheUrl: "calendars/316937.ics",
    cta: "Book this loft"
  },
  {
    title: "Smoky Mountain Gateway",
    type: "Greenway Village apartment",
    tags: ["greenway", "family", "work"],
    sleeps: "Sleeps 6",
    details: ["Greenway Village", "2 bedrooms", "2 bathrooms"],
    description: "A newer Greenway Village stay above Marble Slab Creamery and The Great American Cookie Company, with two king bedrooms, a balcony, and easy access to downtown Maryville.",
    image: "Assets/listings/smoky-mountain-gateway.webp",
    url: "https://stonehouserentals.holidayfuture.com/listings/456253",
    calendarUrl: "https://platform.hostaway.com/ical/Vsf5DNagAkFpbxGZDqav9CIU9de6vxBKOzbSu6yQEthuTwy0VoczjMi1pHllZ7BP/listings/456253.ics",
    calendarCacheUrl: "calendars/456253.ics",
    cta: "Book Greenway Village"
  },
  {
    title: "The Ice Cream Parlor Penthouse Suite",
    type: "Greenway Village apartment",
    tags: ["greenway", "family", "work"],
    sleeps: "Sleeps 6",
    details: ["Greenway Village", "2 bedrooms", "2 bathrooms"],
    description: "A Greenway Village penthouse-style suite above Marble Slab Creamery and The Great American Cookie Company, with room for families or work travelers.",
    image: "Assets/listings/ice-cream-parlor-penthouse.webp",
    url: "https://stonehouserentals.holidayfuture.com/listings/455721",
    calendarUrl: "https://platform.hostaway.com/ical/Vsf5DNagAkFpbxGZDqav9CIU9de6vxBKOzbSu6yQEthuTwy0VoczjMi1pHllZ7BP/listings/455721.ics",
    calendarCacheUrl: "calendars/455721.ics",
    cta: "Book Greenway Village"
  }
];

let currentFilter = "all";
const calendarState = new Map();

function getRentalKey(rental) {
  return rental.title;
}

function parseIcalDate(value) {
  if (!value) return null;
  const cleanValue = value.trim();
  if (/^\d{8}$/.test(cleanValue)) {
    const year = Number(cleanValue.slice(0, 4));
    const month = Number(cleanValue.slice(4, 6)) - 1;
    const day = Number(cleanValue.slice(6, 8));
    return new Date(year, month, day);
  }

  const normalized = cleanValue.replace(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/,
    "$1-$2-$3T$4:$5:$6Z"
  );
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseBusyRanges(icalText) {
  return icalText
    .split("BEGIN:VEVENT")
    .slice(1)
    .map((eventText) => {
      const startMatch = eventText.match(/DTSTART(?:;[^:\r\n]+)?:([^\r\n]+)/);
      const endMatch = eventText.match(/DTEND(?:;[^:\r\n]+)?:([^\r\n]+)/);
      return {
        start: parseIcalDate(startMatch?.[1]),
        end: parseIcalDate(endMatch?.[1])
      };
    })
    .filter((range) => range.start && range.end);
}

function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

async function checkRentalAvailability(rental, checkIn, checkOut) {
  if (!rental.calendarUrl) return null;

  try {
    const response = await fetchCalendar(rental);
    const busyRanges = parseBusyRanges(await response.text());
    const searchStart = new Date(`${checkIn}T00:00:00`);
    const searchEnd = new Date(`${checkOut}T00:00:00`);
    const isAvailable = !busyRanges.some((range) => rangesOverlap(searchStart, searchEnd, range.start, range.end));
    return { status: isAvailable ? "available" : "unavailable" };
  } catch {
    return { status: "unknown" };
  }
}

async function fetchCalendar(rental) {
  const calendarUrls = [rental.calendarUrl, rental.calendarCacheUrl].filter(Boolean);

  for (const url of calendarUrls) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {
      // Try the next source. Live iCal feeds can be blocked by browser CORS.
    }
  }

  throw new Error("Calendar unavailable");
}

function getFilteredRentals() {
  return currentFilter === "all"
    ? rentals
    : rentals.filter((rental) => rental.tags.includes(currentFilter));
}

function sortRentalsForDisplay(rentalsToSort) {
  const hasAvailabilitySearch = calendarState.size > 0;

  return [...rentalsToSort].sort((a, b) => {
    if (!hasAvailabilitySearch) return rentals.indexOf(a) - rentals.indexOf(b);
    const stateA = calendarState.get(getRentalKey(a))?.status;
    const stateB = calendarState.get(getRentalKey(b))?.status;
    const availableA = stateA === "available" ? 0 : 1;
    const availableB = stateB === "available" ? 0 : 1;
    if (availableA !== availableB) return availableA - availableB;
    return rentals.indexOf(a) - rentals.indexOf(b);
  });
}

function buildRentalCard(rental) {
  const state = calendarState.get(getRentalKey(rental));
  const isAvailable = state?.status === "available";
  const isUnavailable = state?.status === "unavailable";
  const isUnknown = state?.status === "unknown";
  const detailHtml = rental.details.map((detail) => `<span>${detail}</span>`).join("");
  const cardClass = isAvailable ? " rental-card--available" : "";
  const availabilityBadge = isAvailable ? `<span class="available-pill">Available</span>` : "";
  const calendarMessage = isAvailable
    ? "Available for selected dates"
    : isUnavailable
      ? "Booked for selected dates"
      : isUnknown
        ? "Calendar could not be checked"
        : "";
  const target = rental.url.startsWith("http") ? ` target="_blank" rel="noopener"` : "";

  return `
    <article class="rental-card${cardClass}" data-tags="${rental.tags.join(" ")}">
      <div class="rental-card__image">
        <img src="${rental.image}" alt="${rental.title} short term rental in Maryville Tennessee" loading="lazy" decoding="async" />
        <span class="badge">${rental.sleeps}</span>
        ${availabilityBadge}
      </div>
      <div class="rental-card__body">
        <p class="rental-card__meta">${rental.type}</p>
        <h3>${rental.title}</h3>
        <p>${rental.description}</p>
        <div class="rental-card__footer">
          <div class="rental-card__details">${detailHtml}</div>
          ${calendarMessage ? `<p class="rental-card__calendar">${calendarMessage}</p>` : ""}
          <a class="button button--primary" href="${rental.url}"${target}>${rental.cta}</a>
        </div>
      </div>
    </article>
  `;
}

function renderRentals() {
  const grid = document.getElementById("listingGrid");
  const broadwayGrid = document.getElementById("broadwayGrid");
  const greenwayGrid = document.getElementById("greenwayGrid");
  const count = document.getElementById("listingCount");

  if (broadwayGrid || greenwayGrid) {
    if (broadwayGrid) {
      const broadwayRentals = sortRentalsForDisplay(rentals.filter((rental) => rental.tags.includes("bella")));
      broadwayGrid.innerHTML = broadwayRentals.map(buildRentalCard).join("");
    }

    if (greenwayGrid) {
      const greenwayRentals = sortRentalsForDisplay(rentals.filter((rental) => rental.tags.includes("greenway")));
      greenwayGrid.innerHTML = greenwayRentals.map(buildRentalCard).join("");
    }

    if (count) count.textContent = "6 rentals shown";
    return;
  }

  if (!grid) return;

  const filtered = sortRentalsForDisplay(getFilteredRentals());
  grid.innerHTML = filtered.map(buildRentalCard).join("");

  if (count) {
    const noun = filtered.length === 1 ? "rental" : "rentals";
    const availableCount = filtered.filter((rental) => calendarState.get(getRentalKey(rental))?.status === "available").length;
    count.textContent = calendarState.size > 0
      ? `${availableCount} available ${availableCount === 1 ? "rental" : "rentals"} shown`
      : `${filtered.length} ${noun} shown`;
  }
}

function showRentalResults() {
  const resultsSection = document.getElementById("rentals");
  if (!resultsSection) return;
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderRentals();
  });
});

document.getElementById("availabilityBtn")?.addEventListener("click", async () => {
  const checkIn = document.getElementById("checkin")?.value;
  const checkOut = document.getElementById("checkout")?.value;
  const note = document.getElementById("availabilityNote");
  if (!note) return;

  if (!checkIn || !checkOut) {
    note.textContent = "Choose a check-in and check-out date to search availability.";
    return;
  }

  if (new Date(`${checkOut}T00:00:00`) <= new Date(`${checkIn}T00:00:00`)) {
    note.textContent = "Choose a check-out date after your check-in date.";
    return;
  }

  const connectedRentals = rentals.filter((rental) => rental.calendarUrl);
  if (connectedRentals.length === 0) {
    note.textContent = "Calendar feeds are not connected yet. Use the booking buttons below for live availability.";
    return;
  }

  note.textContent = `Checking ${connectedRentals.length} connected calendar feed${connectedRentals.length === 1 ? "" : "s"}...`;
  const results = await Promise.all(
    connectedRentals.map(async (rental) => [getRentalKey(rental), await checkRentalAvailability(rental, checkIn, checkOut)])
  );

  results.forEach(([key, state]) => {
    if (state) calendarState.set(key, state);
  });

  renderRentals();

  const availableCount = results.filter(([, state]) => state?.status === "available").length;
  const unknownCount = results.filter(([, state]) => state?.status === "unknown").length;
  if (unknownCount > 0) {
    note.textContent = `${availableCount} rental${availableCount === 1 ? "" : "s"} marked available. ${unknownCount} calendar feed${unknownCount === 1 ? "" : "s"} could not be checked in this browser.`;
    showRentalResults();
    return;
  }

  note.textContent = `${availableCount} rental${availableCount === 1 ? "" : "s"} available for ${checkIn} through ${checkOut}.`;
  showRentalResults();
});

renderRentals();
