// Per-session comprehension questions. Keys are "weekIndex-sessionIndex".
// Each question has prompt, options[], correctIndex (0-based).
// Authoring is a content task — empty entries simply hide the quiz.

export const COMPREHENSION = {
  "0-0": [
    {
      prompt: "Que fait Marie dans la vie ?",
      options: ["Architecte", "Éditrice", "Sommelière"],
      correctIndex: 0,
    },
    {
      prompt: "D'où vient le narrateur ?",
      options: ["Paris", "Hong Kong", "Lyon"],
      correctIndex: 1,
    },
    {
      prompt: "Dans quel quartier travaille Marie ?",
      options: ["Saint-Germain", "Le Marais", "Montmartre"],
      correctIndex: 1,
    },
  ],
  "0-1": [
    {
      prompt: "Le restaurant Le Petit Cler est à combien de minutes de l'hôtel ?",
      options: ["Cinq minutes à pied", "Quinze minutes en taxi", "Une heure"],
      correctIndex: 0,
    },
    {
      prompt: "Qu'est-ce que Léa propose à boire ?",
      options: ["Un café", "Un spritz", "Un verre de vin"],
      correctIndex: 1,
    },
  ],
  "1-0": [
    {
      prompt: "Où est-ce que le client veut s'asseoir ?",
      options: ["Au comptoir", "À l'intérieur", "En terrasse"],
      correctIndex: 2,
    },
    {
      prompt: "Combien coûte le grand crème en terrasse ?",
      options: ["Trois euros", "Quatre euros cinquante", "Sept euros"],
      correctIndex: 1,
    },
  ],
};

export function questionsFor(weekIndex, sessionIndex) {
  return COMPREHENSION[`${weekIndex}-${sessionIndex}`] || [];
}
