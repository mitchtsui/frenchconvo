// Naive content-word extractor for French dialogue. Strips stop words and
// punctuation, keeps tokens of length ≥ 3. Good enough for surfacing "new
// words from this session" without a full POS tagger.

const STOP = new Set([
  "alors","aussi","avec","bien","bon","bonsoir","bonjour","ce","cet","cette","ces",
  "comment","dans","de","des","du","elle","elles","en","est","et","faire","fait",
  "ici","il","ils","je","la","le","les","leur","leurs","lui","ma","mais","mes",
  "moi","mon","ne","nos","notre","nous","oh","ou","où","par","pas","plus","pour",
  "puis","que","qui","quoi","sa","ses","si","sur","ta","tes","ton","tout","tous",
  "très","tu","un","une","vos","votre","vous","ça","cela","ceci","sont","ai","as",
  "avez","avons","ont","ait","aux","au","aussi","etc","oui","non","cest","là",
  "voilà","quelle","quel","quels","quelles","comme","peu","peut","peux","peuvent",
  "vais","va","vont","allez","aller","être","etre","ainsi","encore","déjà","deja",
  "près","prés","entre","sans","contre","aucun","aucune","tout","toute","toutes",
  "rien","jamais","toujours","vraiment","beaucoup","trop","autre","autres","même",
  "donc","peut-etre","peut-être",
]);

function tokenize(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z' -]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function extractContentWords(text) {
  const out = new Set();
  for (const tok of tokenize(text)) {
    const word = tok.replace(/^[ldjmsnctqLDJMSNCTQ]['']/i, "");
    if (!word || word.length < 3) continue;
    if (STOP.has(word)) continue;
    out.add(word);
  }
  return [...out];
}

export function extractSessionVocab(session) {
  const set = new Set();
  for (const line of session.lines) {
    for (const w of extractContentWords(line.fr)) set.add(w);
  }
  return [...set].sort();
}
