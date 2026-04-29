// Tap-to-expand grammar/register notes keyed by exact phrase. Add as needed
// — phrases without a note simply render no expand button.

export const GRAMMAR_NOTES = {
  "Vous pouvez…/Tu peux…":
    "Tu/vous register: vous is the polite/formal form (and also addresses multiple people). Use vous with strangers, in shops and restaurants. Switch to tu only after they offer.",
  "Excusez-moi":
    "Polite imperative of s'excuser. With tu it's 'excuse-moi'. Useful both for getting attention and apologising.",
  "Je vous en prie / De rien":
    "'Je vous en prie' is a more polished 'you're welcome' (formal). 'De rien' is informal and ubiquitous.",
  "Je voudrais un café crème":
    "'Je voudrais' (conditional of vouloir) is the standard polite request form. Always softer than 'je veux'.",
  "Sur place ou à emporter":
    "Standard café/bakery phrase. 'Sur place' = eat in; 'à emporter' = takeaway.",
  "Ça fait combien ?":
    "Casual 'how much?'. More formal: 'C'est combien ?' or 'Quel est le prix ?'.",
  "Il est quelle heure ?":
    "Casual time question. The textbook form is 'Quelle heure est-il ?'.",
  "Le plat du jour ?":
    "Daily special. Worth asking even if it isn't on the menu — most bistrots have one.",
  "La carte des vins":
    "Wine list. The general menu is 'la carte', not 'le menu' (which usually means a fixed-price formula).",
  "Vous me faites confiance ?":
    "Common sommelier phrase: 'Do you trust me?' Useful answer: 'Tout à fait' (absolutely).",
  "Réservation au nom de…":
    "Used at hotels and restaurants. 'Au nom de' = under the name of.",
  "Pour aller à…":
    "Asking directions. Pair with 's'il vous plaît' for politeness.",
  "Aller-retour Lyon":
    "Round trip. 'Un aller simple' = one-way.",
  "Mal à la tête":
    "Pattern: 'avoir mal à + body part'. Mal à la gorge, mal au ventre, mal aux dents.",
  "Ce que j'aime bien…":
    "'Ce que' = 'what' (relative pronoun). 'Ce que j'aime' = what I like.",
  "L'année dernière…":
    "Past time markers cue the passé composé/imparfait. 'Hier', 'la semaine dernière', 'il y a deux jours'.",
  "Ça te dit de… ?":
    "Casual 'feel like…?'. Followed by an infinitive: 'Ça te dit de sortir ?'. Formal: 'Cela vous dit de…'.",
  "Figure-toi que…":
    "'Would you believe…' — sets up an anecdote. Vous form: 'figurez-vous que'.",
  "Je goûterais bien":
    "Conditional of goûter expressing a polite wish: 'I'd like to taste'.",
  "Le terroir":
    "Untranslatable: the combination of soil, climate and tradition that gives a wine its place.",
  "On élève en fût de chêne":
    "'Élever' = age (a wine). 'Fût de chêne' = oak barrel.",
};

export function noteFor(phrase) {
  return GRAMMAR_NOTES[phrase] || null;
}
