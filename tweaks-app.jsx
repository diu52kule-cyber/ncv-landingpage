// tweaks-app.jsx — mounts the Tweaks panel and applies changes to the static landing page.
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryAccent": "#3a6df0",
  "secondaryAccent": "#15b8a6",
  "displayFont": "Sora",
  "radius": 16,
  "showTrust": true,
  "showStats": true,
  "heroHeadline": "Software that solves everyday problems for the way you work.",
  "heroHighlight": "everyday problems",
  "ctaLabel": "Book a demo"
}/*EDITMODE-END*/;

const GFONT = {
  "Sora": "Sora:wght@400;500;600;700;800",
  "Space Grotesk": "Space+Grotesk:wght@400;500;600;700",
  "Manrope": "Manrope:wght@400;500;600;700;800",
  "Poppins": "Poppins:wght@400;500;600;700"
};

function loadFont(name) {
  const spec = GFONT[name];
  if (!spec) return;
  const id = "gf-" + name.replace(/\s+/g, "-");
  if (document.getElementById(id)) return;
  const l = document.createElement("link");
  l.id = id; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=" + spec + "&display=swap";
  document.head.appendChild(l);
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function buildHeadline(full, hi) {
  if (!hi || !full.includes(hi)) return esc(full);
  const i = full.indexOf(hi);
  return esc(full.slice(0, i)) +
    '<span class="grad">' + esc(hi) + '</span>' +
    esc(full.slice(i + hi.length));
}

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", t.primaryAccent);
    root.style.setProperty("--accent-ink", t.primaryAccent);
    root.style.setProperty("--accent-2", t.secondaryAccent);
    root.style.setProperty("--radius", t.radius + "px");
    root.style.setProperty("--radius-sm", Math.max(6, t.radius - 5) + "px");
    root.style.setProperty("--font-display", "'" + t.displayFont + "', system-ui, sans-serif");
    loadFont(t.displayFont);

    const trust = document.querySelector(".trust");
    if (trust) trust.style.display = t.showTrust ? "" : "none";
    const meta = document.querySelector(".hero-meta");
    if (meta) meta.style.display = t.showStats ? "" : "none";

    const h1 = document.getElementById("heroHeadline");
    if (h1) h1.innerHTML = buildHeadline(t.heroHeadline, t.heroHighlight);

    document.querySelectorAll("[data-cta]").forEach((el) => {
      if (el.firstChild && el.firstChild.nodeType === 3) el.firstChild.nodeValue = t.ctaLabel + " ";
      else el.textContent = t.ctaLabel;
    });
  }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Brand colors" />
      <TweakColor label="Primary accent" value={t.primaryAccent}
        options={["#3a6df0", "#5b5fe0", "#0d9488", "#7c5cf0"]}
        onChange={(v) => setTweak("primaryAccent", v)} />
      <TweakColor label="Secondary accent" value={t.secondaryAccent}
        options={["#15b8a6", "#22b07d", "#e0823a", "#3a6df0"]}
        onChange={(v) => setTweak("secondaryAccent", v)} />

      <TweakSection label="Type & shape" />
      <TweakSelect label="Display font" value={t.displayFont}
        options={["Sora", "Space Grotesk", "Manrope", "Poppins"]}
        onChange={(v) => setTweak("displayFont", v)} />
      <TweakSlider label="Corner radius" value={t.radius} min={4} max={28} step={1} unit="px"
        onChange={(v) => setTweak("radius", v)} />

      <TweakSection label="Sections" />
      <TweakToggle label="Trust strip" value={t.showTrust}
        onChange={(v) => setTweak("showTrust", v)} />
      <TweakToggle label="Hero stats" value={t.showStats}
        onChange={(v) => setTweak("showStats", v)} />

      <TweakSection label="Copy" />
      <TweakText label="Hero headline" value={t.heroHeadline}
        onChange={(v) => setTweak("heroHeadline", v)} />
      <TweakText label="Highlighted phrase" value={t.heroHighlight}
        onChange={(v) => setTweak("heroHighlight", v)} />
      <TweakText label="CTA label" value={t.ctaLabel}
        onChange={(v) => setTweak("ctaLabel", v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<TweaksApp />);
