// Produktliste — Preise und Bestände sind Platzhalter, bis der Webshop steht.
export const KATEGORIEN = {
  sizilien: "Sizilianische Produkte",
  kraeuter: "Kräuter",
  tee: "Tees",
  gewuerze: "Gewürze",
};

export const PRODUKTE = [
  { id: "oregano", name: "Wilder Oregano der Iblei", latein: "Origanum vulgare ssp. hirtum", zusatz: "Wildsammlung", kat: "kraeuter", preis: 4.5, fav: true },
  { id: "fenchel", name: "Wilder Fenchel – Samen & Kraut", latein: "Foeniculum vulgare", zusatz: "Finocchietto selvatico", kat: "gewuerze", preis: 3.8, fav: true },
  { id: "kapern", name: "Kapern in Meersalz", latein: "Capparis spinosa", zusatz: "Aus Salina", kat: "sizilien", preis: 5.9, fav: true },
  { id: "salz", name: "Meersalz aus Trapani (Fleur de Sel)", latein: "", zusatz: "Mit Zitrone & Rosmarin", kat: "gewuerze", preis: 2.2, fav: true },
  { id: "thymian", name: "Wilder Thymian der Iblei", latein: "Thymbra capitata", zusatz: "Timo ibleo", kat: "kraeuter", preis: 4.2, fav: true, aus: true },
  { id: "zitrone", name: "Zitrus-Mischung „Siracusa“", latein: "Citrus limon & Citrus sinensis", zusatz: "Zitrone & Blutorange", kat: "tee", preis: 3.9, fav: true },
  { id: "johannisbrot", name: "Johannisbrotpulver der Iblei", latein: "Ceratonia siliqua", zusatz: "Carruba", kat: "sizilien", preis: 4.8, fav: true },
  { id: "lorbeer", name: "Sizilianischer Lorbeer", latein: "Laurus nobilis", zusatz: "Handgebunden", kat: "kraeuter", preis: 2.9, fav: true },
  { id: "minze", name: "Minze & Nepitella", latein: "Mentha spicata · Calamintha nepeta", zusatz: "Eigener Anbau", kat: "tee", preis: 3.6, eigen: true },
  { id: "salbei", name: "Sizilianischer Salbei", latein: "Salvia officinalis", zusatz: "Eigener Anbau", kat: "kraeuter", preis: 3.8, eigen: true, aus: true },
  { id: "basilikum", name: "Basilikum aus Ragusa", latein: "Ocimum basilicum", zusatz: "Eigener Anbau", kat: "kraeuter", preis: 3.4, eigen: true },
];

export const euro = (n) => "€" + n.toFixed(2).replace(".", ",");

export function karte(p) {
  return `
    <article class="produkt">
      <div class="produkt-bild">
        <img src="bilder/${p.id}.jpg" alt="${p.name}" loading="lazy" width="800" height="800">
        ${p.aus ? '<span class="schild">Ausverkauft</span>' : ""}
      </div>
      <h3>${p.name}${p.latein ? ` <span class="latein">(${p.latein})</span>` : ""}</h3>
      <p class="zusatz">${p.zusatz}</p>
      <p class="preis">${p.aus ? "Ausverkauft" : "ab " + euro(p.preis)}</p>
      <button class="knopf klein" data-in-korb="${p.id}" ${p.aus ? "disabled" : ""}>In den Warenkorb</button>
    </article>`;
}

// Warenkorb: nur im Browser gespeichert, eine Kasse gibt es noch nicht.
const SCHLUESSEL = "ibleanherbs-korb";
export function leseKorb() {
  try { return JSON.parse(localStorage.getItem(SCHLUESSEL)) || {}; } catch { return {}; }
}
function schreibeKorb(k) {
  try { localStorage.setItem(SCHLUESSEL, JSON.stringify(k)); } catch {}
}

export function korbAnzeigen() {
  const k = leseKorb();
  const anzahl = Object.values(k).reduce((a, b) => a + b, 0);
  document.querySelectorAll("[data-korb-zahl]").forEach((el) => (el.textContent = anzahl));
  const liste = document.querySelector("#korb-liste");
  if (!liste) return;
  const posten = Object.entries(k).map(([id, n]) => ({ p: PRODUKTE.find((x) => x.id === id), n })).filter((x) => x.p);
  liste.innerHTML = posten.length
    ? posten.map(({ p, n }) => `<li><span>${n} × ${p.name}</span><span>${euro(p.preis * n)}</span>
        <button class="weg" data-weg="${p.id}" aria-label="${p.name} entfernen">×</button></li>`).join("")
    : '<li class="leer">Ihr Warenkorb ist leer.</li>';
  const summe = posten.reduce((s, { p, n }) => s + p.preis * n, 0);
  document.querySelector("#korb-summe").textContent = euro(summe);
}

function hinweis(text) {
  let el = document.querySelector(".hinweis");
  if (!el) { el = document.createElement("div"); el.className = "hinweis"; el.setAttribute("role", "status"); document.body.append(el); }
  el.textContent = text;
  el.classList.add("sichtbar");
  clearTimeout(hinweis.t);
  hinweis.t = setTimeout(() => el.classList.remove("sichtbar"), 2600);
}

export function korbVerdrahten() {
  document.addEventListener("click", (e) => {
    const rein = e.target.closest("[data-in-korb]");
    if (rein) {
      const k = leseKorb(); const id = rein.dataset.inKorb;
      k[id] = (k[id] || 0) + 1; schreibeKorb(k); korbAnzeigen();
      hinweis("In den Warenkorb gelegt – der Webshop ist noch im Aufbau.");
    }
    const weg = e.target.closest("[data-weg]");
    if (weg) { const k = leseKorb(); delete k[weg.dataset.weg]; schreibeKorb(k); korbAnzeigen(); }
    if (e.target.closest("[data-korb-auf]")) document.body.classList.add("korb-offen");
    if (e.target.closest("[data-korb-zu]")) document.body.classList.remove("korb-offen");
    if (e.target.closest("#zur-kasse")) hinweis("Die Kasse folgt bald. Bis dahin bestellen Sie gern per E-Mail.");
  });
  korbAnzeigen();
}
