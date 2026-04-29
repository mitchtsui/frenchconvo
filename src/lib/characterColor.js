const PALETTE = [
  "#1B4332",
  "#8B1A1A",
  "#2C3E6B",
  "#6B4226",
  "#7B5EA7",
  "#5C4033",
  "#4A6741",
  "#C4A35A",
  "#D4456A",
  "#2A7B9B",
];

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function characterColor(name) {
  if (!name) return "var(--muted)";
  if (name === "Narrateur") return "var(--muted)";
  if (name === "Vous") return "var(--accent)";
  if (name === "Annonce SNCF") return "#B91C1C";
  return PALETTE[hashString(name) % PALETTE.length];
}
