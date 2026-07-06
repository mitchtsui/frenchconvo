// Per-session comprehension questions. Keys are "weekIndex-sessionIndex".
// Each question has prompt, options[], correctIndex (0-based).
// Authoring is a content task — empty entries simply hide the quiz.

export const COMPREHENSION = {
  "0-0": [
    {
      prompt: "Que fait Marie dans la vie ?",
      options: ["Architecte", "Éditrice", "Sommelière"],
      correctIndex: 0,
      review: {
        fr: "Moi, je suis architecte. Je travaille surtout sur des projets de rénovation à Paris.",
        en: "Me, I'm an architect. I mostly work on renovation projects in Paris.",
      },
    },
    {
      prompt: "D'où vient le narrateur ?",
      options: ["Paris", "Hong Kong", "Lyon"],
      correctIndex: 1,
      review: {
        fr: "Je viens de Hong Kong, mais j'habite à Londres maintenant.",
        en: "I'm from Hong Kong, but I live in London now.",
      },
    },
    {
      prompt: "Dans quel quartier travaille Marie ?",
      options: ["Saint-Germain", "Le Marais", "Montmartre"],
      correctIndex: 1,
      review: {
        fr: "Mon bureau est dans le Marais. C'est un quartier magnifique. Vous le connaissez ?",
        en: "My office is in Le Marais. It's a beautiful neighbourhood. Do you know it?",
      },
    },
  ],
  "0-1": [
    {
      prompt: "Le restaurant Le Petit Cler est à combien de minutes de l'hôtel ?",
      options: ["Cinq minutes à pied", "Quinze minutes en taxi", "Une heure"],
      correctIndex: 0,
      review: {
        fr: "Vous sortez de l'hôtel, vous tournez à gauche, c'est à cinq minutes à pied.",
        en: "You leave the hotel, turn left, it's a five-minute walk.",
      },
    },
    {
      prompt: "Qu'est-ce que Léa propose à boire ?",
      options: ["Un café", "Un spritz", "Un verre de vin"],
      correctIndex: 1,
      review: {
        fr: "Bon, tu veux boire quoi ? Moi je prends un spritz.",
        en: "So, what do you want to drink? I'm having a spritz.",
      },
    },
  ],
  "1-0": [
    {
      prompt: "Où est-ce que le client veut s'asseoir ?",
      options: ["Au comptoir", "À l'intérieur", "En terrasse"],
      correctIndex: 2,
      review: {
        fr: "Bonjour, est-ce qu'on peut s'asseoir en terrasse ?",
        en: "Hello, can we sit on the terrace?",
      },
    },
    {
      prompt: "Combien coûte le grand crème en terrasse ?",
      options: ["Trois euros", "Quatre euros cinquante", "Sept euros"],
      correctIndex: 1,
      review: {
        fr: "Le grand crème en terrasse, quatre euros cinquante.",
        en: "The large crème on the terrace, four euros fifty.",
      },
    },
  ],
};

export function questionsFor(weekIndex, sessionIndex) {
  return COMPREHENSION[`${weekIndex}-${sessionIndex}`] || [];
}
