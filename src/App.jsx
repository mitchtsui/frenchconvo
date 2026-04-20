import { useState, useRef, useEffect, useCallback } from "react";

const W = [
{week:1,title:"Se retrouver",sub:"Finding Your French Again",color:"#1B4332",sessions:[
{day:"Lun",title:"Bonjour, je suis…",focus:"Self-introduction & greetings",
phrases:["Je m'appelle…","Je viens de…","Enchanté(e)","Qu'est-ce que vous faites dans la vie ?"],
d:[
{c:"Narrateur",fr:"Vous êtes à une soirée dans un appartement du sixième arrondissement.",en:"You're at a party in an apartment in the 6th arrondissement."},
{c:"Marie",fr:"Bonsoir ! Bienvenue, je suis Marie. Et vous, comment vous appelez-vous ?",en:"Good evening! Welcome, I'm Marie. And you, what's your name?"},
{c:"Vous",fr:"Bonsoir Marie, enchanté. Moi, c'est Mitchell.",en:"Good evening Marie, nice to meet you. I'm Mitchell."},
{c:"Marie",fr:"Enchanté, Mitchell ! Vous venez d'où ?",en:"Nice to meet you, Mitchell! Where are you from?"},
{c:"Vous",fr:"Je viens de Hong Kong, mais j'habite à Londres maintenant.",en:"I'm from Hong Kong, but I live in London now."},
{c:"Marie",fr:"Ah, Londres ! J'adore cette ville. Et qu'est-ce que vous faites dans la vie ?",en:"Ah, London! I love that city. And what do you do for a living?"},
{c:"Vous",fr:"Je suis consultant en admission universitaire, et je travaille aussi dans la finance.",en:"I'm a university admissions consultant, and I also work in finance."},
{c:"Marie",fr:"Oh, c'est intéressant ! Deux métiers en même temps, c'est beaucoup de travail, non ?",en:"Oh, that's interesting! Two jobs at once, that's a lot of work, no?"},
{c:"Vous",fr:"Oui, c'est vrai, mais j'aime bien les deux. Et vous, Marie, vous faites quoi ?",en:"Yes, it's true, but I enjoy both. And you, Marie, what do you do?"},
{c:"Marie",fr:"Moi, je suis architecte. Je travaille surtout sur des projets de rénovation à Paris.",en:"Me, I'm an architect. I mostly work on renovation projects in Paris."},
{c:"Vous",fr:"Ah, c'est passionnant ! Vous travaillez dans quel quartier ?",en:"Ah, that's fascinating! Which neighbourhood do you work in?"},
{c:"Marie",fr:"Mon bureau est dans le Marais. C'est un quartier magnifique. Vous le connaissez ?",en:"My office is in Le Marais. It's a beautiful neighbourhood. Do you know it?"},
{c:"Vous",fr:"Pas encore, mais j'aimerais bien le visiter pendant mon séjour.",en:"Not yet, but I'd love to visit it during my stay."},
{c:"Marie",fr:"Je vous le recommande vivement ! Bon, ravi de vous avoir rencontré, Mitchell !",en:"I highly recommend it! Well, lovely meeting you, Mitchell!"},
]},
{day:"Mar",title:"Tu ou vous ?",focus:"Register & politeness",
phrases:["Vous pouvez…/Tu peux…","Excusez-moi","Je vous en prie / De rien"],
d:[
{c:"Narrateur",fr:"D'abord à la réception de l'hôtel, puis dans un bar avec une amie.",en:"First at the hotel reception, then at a bar with a friend."},
{c:"Philippe",fr:"Bonsoir, monsieur. Bienvenue à l'Hôtel Saint-Germain. Que puis-je faire pour vous ?",en:"Good evening, sir. Welcome to Hôtel Saint-Germain. How can I help you?"},
{c:"Vous",fr:"Bonsoir. Excusez-moi, est-ce que vous pourriez m'indiquer comment aller au restaurant Le Petit Cler ?",en:"Good evening. Excuse me, could you tell me how to get to Le Petit Cler restaurant?"},
{c:"Philippe",fr:"Bien sûr. Vous sortez de l'hôtel, vous tournez à gauche, c'est à cinq minutes à pied.",en:"Of course. You leave the hotel, turn left, it's a five-minute walk."},
{c:"Vous",fr:"Merci beaucoup, c'est très aimable.",en:"Thank you very much, that's very kind."},
{c:"Philippe",fr:"Je vous en prie. Bonne soirée, monsieur.",en:"You're welcome. Good evening, sir."},
{c:"Narrateur",fr:"Plus tard, dans un bar, vous retrouvez Léa, une amie française.",en:"Later, at a bar, you meet Léa, a French friend."},
{c:"Léa",fr:"Hé, salut ! Ça fait plaisir de te voir ! Comment tu vas ?",en:"Hey, hi! Great to see you! How are you?"},
{c:"Vous",fr:"Salut Léa ! Ça va super bien, merci. Et toi ?",en:"Hi Léa! I'm doing great, thanks. And you?"},
{c:"Léa",fr:"Ça va ! Dis-moi, tu peux me passer le menu ?",en:"Good! Say, can you pass me the menu?"},
{c:"Vous",fr:"Oui, bien sûr, tiens !",en:"Yes, of course, here you go!"},
{c:"Léa",fr:"Merci ! Bon, tu veux boire quoi ? Moi je prends un spritz.",en:"Thanks! So, what do you want to drink? I'm having a spritz."},
{c:"Vous",fr:"Bonne idée, je prends la même chose.",en:"Good idea, I'll have the same."},
]},
{day:"Mer",title:"Les chiffres qui comptent",focus:"Numbers, prices & time",
phrases:["Ça fait combien ?","Il est quelle heure ?","À quelle heure… ?"],
d:[
{c:"Narrateur",fr:"Au marché de la rue Mouffetard, puis au guichet de la gare.",en:"At the rue Mouffetard market, then at the train station ticket office."},
{c:"Jacques",fr:"Allez ! Les belles tomates, deux euros le kilo ! Bonjour monsieur !",en:"Come on! Beautiful tomatoes, two euros a kilo! Hello sir!"},
{c:"Vous",fr:"Bonjour ! Je voudrais un kilo de tomates, s'il vous plaît.",en:"Hello! I'd like a kilo of tomatoes, please."},
{c:"Jacques",fr:"Voilà ! Et avec ceci ?",en:"Here you go! Anything else?"},
{c:"Vous",fr:"Les pêches, elles sont à combien ?",en:"The peaches, how much are they?"},
{c:"Jacques",fr:"Trois euros cinquante le kilo. Elles sont excellentes !",en:"Three euros fifty a kilo. They're excellent!"},
{c:"Vous",fr:"Un kilo aussi. Ça fait combien en tout ?",en:"A kilo as well. How much altogether?"},
{c:"Jacques",fr:"Deux et trois cinquante, ça fait cinq euros cinquante.",en:"Two and three fifty, that's five euros fifty."},
{c:"Narrateur",fr:"À la gare de Lyon.",en:"At Gare de Lyon station."},
{c:"Sophie",fr:"Bonjour, je peux vous aider ?",en:"Hello, can I help you?"},
{c:"Vous",fr:"À quelle heure est le prochain train pour Lyon ?",en:"What time is the next train to Lyon?"},
{c:"Sophie",fr:"Le prochain est à quatorze heures trente-cinq. Arrivée à seize heures cinquante-deux.",en:"The next one is at 14:35. Arriving at 16:52."},
{c:"Vous",fr:"C'est combien en seconde classe ?",en:"How much in second class?"},
{c:"Sophie",fr:"Soixante-dix-neuf euros, monsieur.",en:"Seventy-nine euros, sir."},
]},
{day:"Jeu",title:"Premiers échanges",focus:"Small talk essentials",
phrases:["Ça va ?","Il fait beau","C'est la première fois ?"],
d:[
{c:"Narrateur",fr:"En terrasse d'un café, un homme s'assoit à la table voisine.",en:"On a café terrace, a man sits at the next table."},
{c:"Antoine",fr:"Bonjour ! Il fait vraiment beau aujourd'hui, non ?",en:"Hello! Really beautiful weather today, isn't it?"},
{c:"Vous",fr:"Oui, c'est magnifique. On a de la chance.",en:"Yes, it's gorgeous. We're lucky."},
{c:"Antoine",fr:"Vous êtes en vacances ?",en:"Are you on holiday?"},
{c:"Vous",fr:"Oui, je suis là pour quelques jours.",en:"Yes, I'm here for a few days."},
{c:"Antoine",fr:"C'est la première fois que vous venez à Paris ?",en:"Is it your first time in Paris?"},
{c:"Vous",fr:"Non, je suis déjà venu plusieurs fois, mais j'adore toujours autant.",en:"No, I've been several times, but I always love it just as much."},
{c:"Antoine",fr:"Vous parlez bien français ! Vous venez d'où ?",en:"You speak French well! Where are you from?"},
{c:"Vous",fr:"De Hong Kong à l'origine, mais j'habite à Londres.",en:"From Hong Kong originally, but I live in London."},
{c:"Antoine",fr:"Qu'est-ce que vous pensez de Paris ?",en:"What do you think of Paris?"},
{c:"Vous",fr:"J'adore l'ambiance, les cafés, la nourriture... et le vin, bien sûr !",en:"I love the atmosphere, the cafés, the food... and the wine, of course!"},
{c:"Antoine",fr:"Vous restez combien de temps ?",en:"How long are you staying?"},
{c:"Vous",fr:"Une semaine. Pas assez long, malheureusement.",en:"One week. Not long enough, unfortunately."},
{c:"Antoine",fr:"C'est jamais assez long, Paris ! Bonne journée !",en:"It's never long enough, Paris! Have a good day!"},
]},
{day:"Ven",title:"À l'aéroport",focus:"Airport arrival",
phrases:["Je reste cinq jours","Je ne comprends pas","Plus lentement"],
d:[
{c:"Narrateur",fr:"Vous atterrissez à Charles de Gaulle.",en:"You land at Charles de Gaulle airport."},
{c:"Agent Moreau",fr:"Bonjour. Votre passeport, s'il vous plaît.",en:"Hello. Your passport, please."},
{c:"Vous",fr:"Voilà, monsieur.",en:"Here you are, sir."},
{c:"Agent Moreau",fr:"Quel est le but de votre visite ?",en:"What's the purpose of your visit?"},
{c:"Vous",fr:"Je suis en vacances. Je reste cinq jours.",en:"I'm on holiday. I'm staying five days."},
{c:"Agent Moreau",fr:"Où logez-vous ?",en:"Where are you staying?"},
{c:"Vous",fr:"À l'Hôtel Saint-Germain, dans le sixième.",en:"At Hôtel Saint-Germain, in the 6th."},
{c:"Agent Moreau",fr:"Très bien. Bon séjour.",en:"Very good. Enjoy your stay."},
{c:"Narrateur",fr:"Au bureau d'information.",en:"At the information desk."},
{c:"Claire",fr:"Bonjour, je peux vous renseigner ?",en:"Hello, can I help you with anything?"},
{c:"Vous",fr:"Pour aller à la station de taxis, s'il vous plaît ?",en:"How do I get to the taxi stand, please?"},
{c:"Claire",fr:"Suivez les panneaux sortie, puis c'est tout droit.",en:"Follow the exit signs, then it's straight ahead."},
{c:"Hassan",fr:"Bonjour ! Vous allez où ?",en:"Hello! Where are you going?"},
{c:"Vous",fr:"À l'Hôtel Saint-Germain, rue de Rennes.",en:"To Hôtel Saint-Germain, rue de Rennes."},
{c:"Hassan",fr:"D'accord, quarante-cinq minutes avec le trafic. En route !",en:"OK, forty-five minutes with traffic. Let's go!"},
]}
]},
{week:2,title:"Au café",sub:"Coffee Culture",color:"#5C4033",sessions:[
{day:"Lun",title:"Un café, s'il vous plaît",focus:"Ordering drinks",
phrases:["Je voudrais un café crème","Sur place ou à emporter","En terrasse"],
d:[
{c:"Narrateur",fr:"Un petit café du Marais, un matin de printemps.",en:"A small café in Le Marais, a spring morning."},
{c:"Lucas",fr:"Bonjour ! Installez-vous, je suis à vous tout de suite.",en:"Hello! Take a seat, I'll be right with you."},
{c:"Vous",fr:"Bonjour, est-ce qu'on peut s'asseoir en terrasse ?",en:"Hello, can we sit on the terrace?"},
{c:"Lucas",fr:"Bien sûr, il reste une table au soleil. Suivez-moi.",en:"Of course, there's a table left in the sun. Follow me."},
{c:"Lucas",fr:"Alors, qu'est-ce que je vous sers ?",en:"So, what can I get you?"},
{c:"Vous",fr:"Je voudrais un café crème, s'il vous plaît. Grand.",en:"I'd like a café crème, please. Large."},
{c:"Lucas",fr:"Un grand crème, très bien. Autre chose ?",en:"One large crème, very good. Anything else?"},
{c:"Vous",fr:"Non merci, juste le café. C'est combien ?",en:"No thanks, just the coffee. How much is it?"},
{c:"Lucas",fr:"Le grand crème en terrasse, quatre euros cinquante.",en:"The large crème on the terrace, four euros fifty."},
{c:"Vous",fr:"Très bien, merci.",en:"Very good, thanks."},
{c:"Lucas",fr:"Je vous apporte ça tout de suite !",en:"I'll bring it right away!"},
]},
{day:"Mar",title:"Et avec ceci ?",focus:"Pastries & changing orders",
phrases:["Et avec ceci ?","En fait, je vais prendre…","Qu'est-ce que vous conseillez ?"],
d:[
{c:"Narrateur",fr:"Au comptoir d'un café-boulangerie.",en:"At the counter of a café-bakery."},
{c:"Camille",fr:"Bonjour ! Qu'est-ce que ce sera ?",en:"Hello! What'll it be?"},
{c:"Vous",fr:"Un allongé, s'il vous plaît.",en:"A long black, please."},
{c:"Camille",fr:"Un allongé. Et avec ceci ?",en:"One long black. And with that?"},
{c:"Vous",fr:"Qu'est-ce que vous me conseillez comme viennoiserie ?",en:"What would you recommend for a pastry?"},
{c:"Camille",fr:"Les pains au chocolat sont excellents, ils sortent du four.",en:"The pains au chocolat are excellent, they're fresh out of the oven."},
{c:"Vous",fr:"Un pain au chocolat alors.",en:"A pain au chocolat then."},
{c:"Camille",fr:"Oh, désolée, il n'en reste plus. Ça part vite le matin !",en:"Oh, sorry, there are none left. They go fast in the morning!"},
{c:"Vous",fr:"Ah, dommage. En fait, je vais prendre un croissant à la place.",en:"Ah, too bad. Actually, I'll have a croissant instead."},
{c:"Camille",fr:"Excellent choix ! Ce sera tout ?",en:"Excellent choice! Will that be all?"},
{c:"Vous",fr:"Oui, ce sera tout.",en:"Yes, that's all."},
{c:"Camille",fr:"Un allongé et un croissant, cinq euros vingt.",en:"One long black and a croissant, five euros twenty."},
]},
{day:"Mer",title:"C'est pour emporter",focus:"Takeaway & paying",
phrases:["Sur place ou à emporter ?","L'addition","Payer par carte ?"],
d:[
{c:"Narrateur",fr:"Un café fréquenté, à l'heure du déjeuner.",en:"A busy café at lunchtime."},
{c:"Thomas",fr:"Bonjour ! Sur place ou à emporter ?",en:"Hello! Eating in or takeaway?"},
{c:"Vous",fr:"À emporter. Un expresso et un sandwich jambon-beurre.",en:"Takeaway. An espresso and a ham-and-butter sandwich."},
{c:"Thomas",fr:"Le sandwich, avec des cornichons ?",en:"The sandwich, with gherkins?"},
{c:"Vous",fr:"Oui, avec cornichons, merci.",en:"Yes, with gherkins, thanks."},
{c:"Thomas",fr:"Ça fait sept euros quarante.",en:"That's seven euros forty."},
{c:"Vous",fr:"Je peux payer par carte ?",en:"Can I pay by card?"},
{c:"Thomas",fr:"Désolé, le terminal est en panne. C'est seulement en espèces aujourd'hui.",en:"Sorry, the card machine is down. Cash only today."},
{c:"Vous",fr:"Attendez, je regarde si j'ai de la monnaie.",en:"Wait, let me see if I have change."},
{c:"Thomas",fr:"Pas de souci, prenez votre temps.",en:"No worries, take your time."},
{c:"Vous",fr:"Voilà, un billet de dix.",en:"Here, a ten-euro note."},
{c:"Thomas",fr:"Voici votre monnaie : deux euros soixante. Bon appétit !",en:"Here's your change: two euros sixty. Enjoy!"},
]},
{day:"Jeu",title:"Les petits problèmes",focus:"Handling café issues",
phrases:["Excusez-moi, j'avais commandé…","Serait-il possible de…","Pas de souci"],
d:[
{c:"Narrateur",fr:"Le serveur apporte votre commande... mais ce n'est pas la bonne.",en:"The server brings your order... but it's not the right one."},
{c:"Julien",fr:"Et voilà ! Un thé vert et une tarte aux pommes.",en:"Here you go! A green tea and an apple tart."},
{c:"Vous",fr:"Excusez-moi, j'avais commandé un café crème, pas un thé vert.",en:"Excuse me, I ordered a café crème, not a green tea."},
{c:"Julien",fr:"Oh pardon, je me suis trompé de table. Je reviens tout de suite.",en:"Oh sorry, I mixed up the tables. I'll be right back."},
{c:"Vous",fr:"Pas de souci, ça arrive.",en:"No worries, it happens."},
{c:"Julien",fr:"Voilà votre café crème ! Encore désolé.",en:"Here's your café crème! Sorry again."},
{c:"Vous",fr:"Merci. Hmm, le café est un peu froid. Serait-il possible de le réchauffer ?",en:"Thanks. Hmm, the coffee is a bit cold. Would it be possible to reheat it?"},
{c:"Julien",fr:"Oh non, je suis vraiment désolé ! Je vous en refais un tout chaud.",en:"Oh no, I'm really sorry! I'll make you a fresh hot one."},
{c:"Vous",fr:"C'est gentil, merci.",en:"That's kind, thank you."},
{c:"Julien",fr:"Voici un nouveau café, bien chaud ! Avec un petit biscuit pour me faire pardonner.",en:"Here's a new coffee, nice and hot! With a little biscuit to make up for it."},
{c:"Vous",fr:"Ha ha, c'est adorable. Merci Julien !",en:"Ha ha, that's sweet. Thanks Julien!"},
]},
{day:"Ven",title:"Matin parisien",focus:"Full café scene",
phrases:["Le code Wi-Fi ?","Bonne journée !","C'était très bon"],
d:[
{c:"Narrateur",fr:"Un beau matin, rue des Martyrs. Vous entrez dans un café avec terrasse.",en:"A beautiful morning on rue des Martyrs. You enter a café with a terrace."},
{c:"Émilie",fr:"Bonjour ! J'ai une petite table en terrasse si vous voulez.",en:"Hello! I have a small table on the terrace if you'd like."},
{c:"Vous",fr:"Parfait, merci ! Un café crème et un croissant, s'il vous plaît.",en:"Perfect, thanks! A café crème and a croissant, please."},
{c:"Émilie",fr:"Très bon choix ! Je vous apporte ça.",en:"Great choice! I'll bring that over."},
{c:"Vous",fr:"Est-ce que vous avez le Wi-Fi ? Le code, s'il vous plaît ?",en:"Do you have Wi-Fi? The code, please?"},
{c:"Émilie",fr:"Oui, c'est « café2024 », tout en minuscules.",en:"Yes, it's 'café2024', all lowercase."},
{c:"Marc",fr:"Excusez-moi, vous êtes du quartier ?",en:"Excuse me, are you from the neighbourhood?"},
{c:"Vous",fr:"Non, je suis touriste, en fait.",en:"No, I'm a tourist, actually."},
{c:"Marc",fr:"Bienvenue ! Il y a un petit marché le dimanche, ça vaut le coup.",en:"Welcome! There's a small market on Sundays, it's worth it."},
{c:"Vous",fr:"Merci pour le conseil !",en:"Thanks for the tip!"},
{c:"Émilie",fr:"L'addition : six euros quatre-vingts.",en:"The bill: six euros eighty."},
{c:"Vous",fr:"Voilà. Merci, c'était très bon ! Bonne journée !",en:"Here you go. Thanks, it was very good! Have a good day!"},
{c:"Émilie",fr:"Merci, bonne journée et bon séjour !",en:"Thank you, good day and enjoy your stay!"},
]}
]},
{week:3,title:"À table",sub:"Restaurant Dining",color:"#8B1A1A",sessions:[
{day:"Lun",title:"Réservation",focus:"Booking & arrival",phrases:["Je voudrais réserver","Au nom de…","Près de la fenêtre"],
d:[
{c:"Narrateur",fr:"Vous appelez un restaurant, puis vous arrivez le soir même.",en:"You call a restaurant, then arrive that same evening."},
{c:"Isabelle",fr:"Le Comptoir du Panthéon, bonsoir !",en:"Le Comptoir du Panthéon, good evening!"},
{c:"Vous",fr:"Bonsoir, je voudrais réserver une table pour deux ce soir, à vingt heures.",en:"Good evening, I'd like to book a table for two tonight, at 8pm."},
{c:"Isabelle",fr:"Pour deux, à vingt heures. C'est à quel nom ?",en:"For two, at 8pm. What name?"},
{c:"Vous",fr:"Au nom de Mitchell. Près de la fenêtre, si possible.",en:"Under Mitchell. Near the window, if possible."},
{c:"Isabelle",fr:"C'est noté. À ce soir !",en:"Noted. See you tonight!"},
{c:"Narrateur",fr:"Le soir, à l'entrée du restaurant.",en:"That evening, at the restaurant entrance."},
{c:"Isabelle",fr:"Bonsoir ! Vous avez réservé ?",en:"Good evening! Do you have a reservation?"},
{c:"Vous",fr:"Oui, au nom de Mitchell, pour vingt heures.",en:"Yes, under Mitchell, for 8pm."},
{c:"Isabelle",fr:"J'ai pu vous garder la table près de la fenêtre. Suivez-moi !",en:"I managed to keep the window table for you. Follow me!"},
{c:"Vous",fr:"Merci beaucoup, c'est parfait.",en:"Thank you very much, that's perfect."},
]},
{day:"Mar",title:"La carte",focus:"Ordering food",phrases:["Le plat du jour ?","Vous conseillez ?","Allergique aux noix"],
d:[
{c:"Narrateur",fr:"Vous êtes installé. Le serveur arrive.",en:"You're seated. The waiter arrives."},
{c:"Raphaël",fr:"Bonsoir ! En plat du jour, on a un confit de canard avec des pommes sarladaises.",en:"Good evening! Today's special is duck confit with Sarladaise potatoes."},
{c:"Vous",fr:"Et comme poisson ?",en:"And for fish?"},
{c:"Raphaël",fr:"Un bar grillé, servi avec des légumes de saison.",en:"Grilled sea bass, served with seasonal vegetables."},
{c:"Vous",fr:"Qu'est-ce que vous me conseillez ?",en:"What would you recommend?"},
{c:"Raphaël",fr:"Le confit de canard est notre spécialité. Tout le monde l'adore.",en:"The duck confit is our specialty. Everyone loves it."},
{c:"Vous",fr:"Le confit alors. Et en entrée, la soupe à l'oignon.",en:"The confit then. And for starter, the onion soup."},
{c:"Raphaël",fr:"Excellent ! Et pour votre accompagnant ?",en:"Excellent! And for your companion?"},
{c:"Vous",fr:"Le bar grillé. Par contre, je suis allergique aux noix.",en:"The sea bass. By the way, I'm allergic to nuts."},
{c:"Raphaël",fr:"Aucun souci, pas de noix dans le confit. Je note en cuisine.",en:"No problem, no nuts in the confit. I'll note it in the kitchen."},
{c:"Vous",fr:"Merci beaucoup.",en:"Thank you very much."},
]},
{day:"Mer",title:"Le vin",focus:"Wine & drinks",phrases:["La carte des vins","Vous conseillez avec… ?","Eau plate"],
d:[
{c:"Narrateur",fr:"Le sommelier arrive à votre table.",en:"The sommelier arrives at your table."},
{c:"Dominique",fr:"Bonsoir ! Souhaitez-vous voir la carte des vins ?",en:"Good evening! Would you like to see the wine list?"},
{c:"Vous",fr:"Oui. Qu'est-ce que vous conseillez avec le confit et le bar ?",en:"Yes. What do you recommend with the confit and the bass?"},
{c:"Dominique",fr:"Pour le canard, un Cahors. Fruité et charpenté.",en:"For the duck, a Cahors. Fruity and full-bodied."},
{c:"Vous",fr:"Et pour le poisson ?",en:"And for the fish?"},
{c:"Dominique",fr:"Un Chablis. Blanc sec, très minéral, parfait avec le poisson.",en:"A Chablis. Dry white, very mineral, perfect with fish."},
{c:"Vous",fr:"On pourrait prendre un verre de chaque ?",en:"Could we have a glass of each?"},
{c:"Dominique",fr:"Tout à fait. Un verre de Cahors et un verre de Chablis.",en:"Absolutely. A glass of Cahors and a glass of Chablis."},
{c:"Vous",fr:"Et une bouteille d'eau plate aussi, s'il vous plaît.",en:"And a bottle of still water too, please."},
{c:"Dominique",fr:"C'est noté ! En apéritif, un kir peut-être ?",en:"Noted! An aperitif, perhaps a kir?"},
{c:"Vous",fr:"Oui, deux kirs, s'il vous plaît.",en:"Yes, two kirs, please."},
]},
{day:"Jeu",title:"L'addition",focus:"Finishing & paying",phrases:["L'addition","Payer séparément","C'était délicieux"],
d:[
{c:"Narrateur",fr:"Fin du repas. Le serveur s'approche.",en:"End of the meal. The waiter approaches."},
{c:"Raphaël",fr:"Tout s'est bien passé ? La carte des desserts ?",en:"Was everything alright? The dessert menu?"},
{c:"Vous",fr:"C'était délicieux ! Pas de dessert, mais deux expressos et l'addition.",en:"It was delicious! No dessert, but two espressos and the bill."},
{c:"Raphaël",fr:"Deux expressos et l'addition, c'est noté.",en:"Two espressos and the bill, noted."},
{c:"Raphaël",fr:"Voilà vos cafés et la note.",en:"Here are your coffees and the bill."},
{c:"Vous",fr:"Il y a un supplément fromage de huit euros, mais on n'a pas commandé de fromage.",en:"There's a cheese supplement of eight euros, but we didn't order cheese."},
{c:"Raphaël",fr:"Vous avez raison, c'est une erreur. Je corrige tout de suite.",en:"You're right, it's a mistake. I'll fix it right away."},
{c:"Vous",fr:"Et le service est compris ?",en:"And is service included?"},
{c:"Raphaël",fr:"Oui, service inclus. Voilà la note corrigée : quatre-vingt-sept euros.",en:"Yes, service is included. Here's the corrected bill: eighty-seven euros."},
{c:"Vous",fr:"C'était vraiment excellent, mes compliments au chef !",en:"It was really excellent, my compliments to the chef!"},
{c:"Raphaël",fr:"Merci beaucoup ! Bonne soirée.",en:"Thank you very much! Good evening."},
]},
{day:"Ven",title:"Dîner en brasserie",focus:"Full restaurant",phrases:["Autre chose ?","On a très bien mangé","Bonne soirée"],
d:[
{c:"Narrateur",fr:"Vous arrivez sans réservation dans une brasserie animée.",en:"You arrive without a reservation at a lively brasserie."},
{c:"François",fr:"Bonsoir ! Vous avez réservé ?",en:"Good evening! Do you have a reservation?"},
{c:"Vous",fr:"Non. Vous avez de la place pour deux ?",en:"No. Do you have room for two?"},
{c:"François",fr:"J'ai une table au fond, près du bar. Ça vous va ?",en:"I have a table at the back, near the bar. Does that work?"},
{c:"Vous",fr:"Parfait, merci !",en:"Perfect, thanks!"},
{c:"Raphaël",fr:"Bonsoir ! En plat du jour, une sole meunière.",en:"Good evening! Today's special is sole meunière."},
{c:"Vous",fr:"La sole pour moi. Et les huîtres pour commencer.",en:"The sole for me. And oysters to start."},
{c:"Raphaël",fr:"Le plateau de fromages est terminé ce soir, désolé.",en:"The cheese board is finished tonight, sorry."},
{c:"Vous",fr:"Qu'est-ce que vous avez d'autre en dessert ?",en:"What else do you have for dessert?"},
{c:"Raphaël",fr:"Une crème brûlée maison et une tarte Tatin.",en:"Homemade crème brûlée and a tarte Tatin."},
{c:"Dominique",fr:"Pour le vin, un Sancerre avec la sole ? Frais et délicat.",en:"For the wine, a Sancerre with the sole? Fresh and delicate."},
{c:"Vous",fr:"Une demi-bouteille de Sancerre, s'il vous plaît.",en:"A half-bottle of Sancerre, please."},
{c:"Vous",fr:"On a très bien mangé, merci ! Bonne soirée !",en:"We ate very well, thanks! Good evening!"},
]}
]},
{week:4,title:"À l'hôtel",sub:"Check-in to Check-out",color:"#2C3E6B",sessions:[
{day:"Lun",title:"J'ai une réservation",focus:"Check-in",phrases:["Réservation au nom de…","Petit-déjeuner inclus ?","Code Wi-Fi ?"],
d:[
{c:"Nathalie",fr:"Bonsoir, bienvenue ! Vous avez une réservation ?",en:"Good evening, welcome! Do you have a reservation?"},
{c:"Vous",fr:"Oui, au nom de Mitchell, pour trois nuits.",en:"Yes, under Mitchell, for three nights."},
{c:"Nathalie",fr:"Chambre double, du quinze au dix-huit. C'est bien ça ?",en:"Double room, 15th to 18th. Is that right?"},
{c:"Vous",fr:"Oui. Le petit-déjeuner est inclus ?",en:"Yes. Is breakfast included?"},
{c:"Nathalie",fr:"Oui, de sept heures à dix heures, au rez-de-chaussée.",en:"Yes, from 7 to 10, on the ground floor."},
{c:"Vous",fr:"Et le code Wi-Fi, s'il vous plaît ?",en:"And the Wi-Fi code, please?"},
{c:"Nathalie",fr:"C'est « jardin2024 ». La chambre n'est pas encore prête, vous pourriez patienter au bar ? Café offert.",en:"It's 'jardin2024'. The room isn't ready yet, could you wait at the bar? Free coffee."},
{c:"Vous",fr:"D'accord, pas de souci. Merci !",en:"OK, no problem. Thanks!"},
]},
{day:"Mar",title:"Vous pourriez m'aider ?",focus:"Requests",phrases:["Je pourrais avoir… ?","Réserver un taxi ?","Un réveil à sept heures"],
d:[
{c:"Olivier",fr:"Réception, bonsoir. Olivier à votre service.",en:"Reception, good evening. Olivier at your service."},
{c:"Vous",fr:"Est-ce que je pourrais avoir des serviettes supplémentaires ?",en:"Could I have some extra towels?"},
{c:"Olivier",fr:"Bien sûr, dans dix minutes.",en:"Of course, in ten minutes."},
{c:"Vous",fr:"Et vous pourriez me réserver un taxi pour demain, huit heures, direction la gare de Lyon ?",en:"And could you book me a taxi for tomorrow, 8am, to Gare de Lyon?"},
{c:"Olivier",fr:"C'est noté. Autre chose ?",en:"Noted. Anything else?"},
{c:"Vous",fr:"Un réveil à sept heures, s'il vous plaît.",en:"A wake-up call at 7am, please."},
{c:"Olivier",fr:"C'est noté. Vous connaissez un bon restaurant pas trop loin ?",en:"Noted. Do you know a good restaurant not too far?"},
{c:"Vous",fr:"Justement, j'allais vous demander ! Une recommandation ?",en:"Actually, I was about to ask! Any recommendation?"},
{c:"Olivier",fr:"Le Bouillon Chartier, à dix minutes à pied. Traditionnel et très bon.",en:"Bouillon Chartier, a ten-minute walk. Traditional and very good."},
{c:"Vous",fr:"Merci beaucoup, Olivier !",en:"Thank you very much, Olivier!"},
]},
{day:"Mer",title:"Il y a un problème",focus:"Complaints",phrases:["La clim ne marche pas","Changer de chambre","Envoyer quelqu'un"],
d:[
{c:"Nathalie",fr:"Réception, bonsoir ?",en:"Reception, good evening?"},
{c:"Vous",fr:"La climatisation ne marche pas, et la chambre au-dessus est très bruyante.",en:"The air conditioning isn't working, and the room above is very noisy."},
{c:"Nathalie",fr:"Je suis désolée. Souhaitez-vous changer de chambre ?",en:"I'm sorry. Would you like to change rooms?"},
{c:"Vous",fr:"Serait-il possible, oui ? Une chambre plus calme.",en:"Would it be possible, yes? A quieter room."},
{c:"Nathalie",fr:"J'ai une chambre au troisième, côté cour. Beaucoup plus calme.",en:"I have a room on the third floor, courtyard side. Much quieter."},
{c:"Vous",fr:"Ça me va. La climatisation fonctionne ?",en:"That works for me. Does the AC work?"},
{c:"Nathalie",fr:"Oui, tout fonctionne. Et en compensation, le petit-déjeuner est offert demain.",en:"Yes, everything works. And as compensation, breakfast is on us tomorrow."},
{c:"Vous",fr:"C'est très aimable, merci.",en:"That's very kind, thank you."},
]},
{day:"Jeu",title:"Le départ",focus:"Check-out",phrases:["Je voudrais régler","Ce montant ?","Merci pour l'accueil"],
d:[
{c:"Nathalie",fr:"Bonjour ! Vous nous quittez déjà ?",en:"Good morning! Leaving us already?"},
{c:"Vous",fr:"Oui. Je voudrais régler, s'il vous plaît.",en:"Yes. I'd like to settle the bill, please."},
{c:"Nathalie",fr:"Trois nuits à cent vingt euros, plus le minibar.",en:"Three nights at a hundred and twenty euros, plus the minibar."},
{c:"Vous",fr:"Le minibar ? Je n'ai rien pris au minibar.",en:"The minibar? I didn't take anything from the minibar."},
{c:"Nathalie",fr:"C'est une erreur, je l'enlève. Total : trois cent soixante euros.",en:"It's a mistake, I'll remove it. Total: three hundred and sixty euros."},
{c:"Vous",fr:"Je peux avoir une facture détaillée ?",en:"Can I have a detailed receipt?"},
{c:"Nathalie",fr:"Bien sûr. Voilà.",en:"Of course. Here it is."},
{c:"Karim",fr:"Bonjour ! Je vous aide avec les bagages ? Le taxi est là.",en:"Hello! Shall I help with the luggage? The taxi is here."},
{c:"Vous",fr:"Merci pour votre accueil, c'était très agréable.",en:"Thank you for your hospitality, it was very pleasant."},
{c:"Nathalie",fr:"Bon voyage ! On espère vous revoir.",en:"Have a good trip! We hope to see you again."},
]},
{day:"Ven",title:"Hôtel boutique",focus:"Full hotel stay",phrases:["J'avais réservé une double","Pas ce qui était prévu","Bonne continuation"],
d:[
{c:"Nathalie",fr:"Bonsoir ! Votre nom ?",en:"Good evening! Your name?"},
{c:"Vous",fr:"Mitchell. J'avais réservé une chambre double.",en:"Mitchell. I had booked a double room."},
{c:"Nathalie",fr:"Je vois une chambre simple dans le système.",en:"I see a single room in the system."},
{c:"Vous",fr:"Ce n'est pas ce qui était prévu. Voici ma confirmation.",en:"That's not what was booked. Here's my confirmation."},
{c:"Nathalie",fr:"Vous avez raison, c'est notre erreur. Double supérieure, sans supplément.",en:"You're right, it's our mistake. Superior double, no extra charge."},
{c:"Vous",fr:"Merci, c'est aimable.",en:"Thank you, that's kind."},
{c:"Olivier",fr:"Bonjour ! Qu'est-ce que je peux faire pour vous ?",en:"Hello! What can I do for you?"},
{c:"Vous",fr:"Un oreiller supplémentaire, s'il vous plaît.",en:"An extra pillow, please."},
{c:"Olivier",fr:"Tout de suite !",en:"Right away!"},
{c:"Vous",fr:"On s'en va. Merci pour tout, malgré le petit souci au début.",en:"We're off. Thanks for everything, despite the little issue at the start."},
{c:"Nathalie",fr:"Encore désolée ! Bonne continuation !",en:"Sorry again! All the best!"},
]}
]},
{week:5,title:"Se déplacer",sub:"Getting Around",color:"#6B4226",sessions:[
{day:"Lun",title:"Pour aller à…",focus:"Directions",phrases:["Pour aller à…","C'est loin ?","Cinq minutes à pied"],
d:[
{c:"Vous",fr:"Excusez-moi, pour aller au Musée d'Orsay, s'il vous plaît ?",en:"Excuse me, how do I get to the Musée d'Orsay, please?"},
{c:"Sylvie",fr:"Tout droit jusqu'au bout de cette rue, puis à gauche sur le boulevard.",en:"Straight ahead to the end of this street, then left on the boulevard."},
{c:"Vous",fr:"C'est loin d'ici ?",en:"Is it far from here?"},
{c:"Sylvie",fr:"Dix minutes à pied, pas plus.",en:"Ten minutes on foot, no more."},
{c:"Vous",fr:"Et il y a une pharmacie dans le coin ?",en:"And is there a pharmacy nearby?"},
{c:"Sylvie",fr:"Juste après le feu rouge, à droite. Grande croix verte.",en:"Just past the traffic light, on the right. Big green cross."},
{c:"Vous",fr:"Merci beaucoup, bonne journée !",en:"Thank you very much, have a good day!"},
{c:"Sylvie",fr:"De rien, bonne visite !",en:"You're welcome, enjoy your visit!"},
]},
{day:"Mar",title:"Le métro",focus:"Public transport",phrases:["Un carnet","Quelle ligne ?","Je descends"],
d:[
{c:"Vous",fr:"Un carnet de tickets, s'il vous plaît.",en:"A book of tickets, please."},
{c:"Fabrice",fr:"Seize euros vingt pour dix tickets.",en:"Sixteen euros twenty for ten tickets."},
{c:"Vous",fr:"C'est quelle ligne pour Montmartre ?",en:"Which line for Montmartre?"},
{c:"Fabrice",fr:"Ligne quatre, direction Porte de Clignancourt. Station Anvers. C'est direct.",en:"Line 4, direction Porte de Clignancourt. Anvers station. It's direct."},
{c:"Vous",fr:"C'est bien la direction Clignancourt ici ?",en:"Is this the right direction for Clignancourt?"},
{c:"Chloé",fr:"Oui ! Vous allez où ? Anvers ? C'est dans trois arrêts. Je vous dis quand on y est.",en:"Yes! Where are you going? Anvers? It's in three stops. I'll tell you when we're there."},
{c:"Vous",fr:"Merci, c'est gentil !",en:"Thanks, that's kind!"},
{c:"Chloé",fr:"C'est la prochaine !",en:"It's the next one!"},
{c:"Vous",fr:"Merci ! Pardon, je descends !",en:"Thanks! Excuse me, I'm getting off!"},
]},
{day:"Mer",title:"En taxi",focus:"Taxis",phrases:["C'est à combien ?","Déposez-moi ici","Un reçu"],
d:[
{c:"Youssef",fr:"Bonjour ! Vous allez où ?",en:"Hello! Where are you going?"},
{c:"Vous",fr:"Au vingt-trois rue du Bac.",en:"23 rue du Bac."},
{c:"Youssef",fr:"En route ! Vous êtes en vacances ? D'où venez-vous ?",en:"Let's go! Are you on holiday? Where are you from?"},
{c:"Vous",fr:"De Hong Kong, mais j'habite à Londres. J'adore Paris !",en:"From Hong Kong, but I live in London. I love Paris!"},
{c:"Youssef",fr:"Si vous aimez le vin, allez dans le quartier Bercy, il y a des caves magnifiques.",en:"If you like wine, go to the Bercy area, there are wonderful wine cellars."},
{c:"Vous",fr:"C'est à combien, la course ?",en:"How much is the fare?"},
{c:"Youssef",fr:"On est à quatorze euros. On arrive presque.",en:"We're at fourteen euros. We're almost there."},
{c:"Vous",fr:"Déposez-moi ici, au coin. Parfait.",en:"Drop me here, at the corner. Perfect."},
{c:"Youssef",fr:"Quinze euros cinquante.",en:"Fifteen euros fifty."},
{c:"Vous",fr:"Un reçu, s'il vous plaît. Merci !",en:"A receipt, please. Thanks!"},
]},
{day:"Jeu",title:"Le train",focus:"Train travel",phrases:["Aller-retour Lyon","C'est direct ?","Du retard ?"],
d:[
{c:"Véronique",fr:"Bonjour, je peux vous aider ?",en:"Hello, can I help you?"},
{c:"Vous",fr:"Un aller-retour Paris-Lyon, seconde classe.",en:"A round trip Paris-Lyon, second class."},
{c:"Véronique",fr:"Départ demain à neuf heures dix, arrivée onze heures cinq. C'est direct.",en:"Departing tomorrow at 9:10, arriving 11:05. It's direct."},
{c:"Vous",fr:"Et le retour dimanche soir ?",en:"And the return Sunday evening?"},
{c:"Véronique",fr:"Dix-huit heures quarante-cinq. Total : quatre-vingt-douze euros.",en:"6:45pm. Total: ninety-two euros."},
{c:"Vous",fr:"C'est quel quai ?",en:"Which platform?"},
{c:"Véronique",fr:"Affiché trente minutes avant le départ.",en:"Displayed thirty minutes before departure."},
{c:"Annonce SNCF",fr:"Le TGV à destination de Lyon est retardé de vingt minutes.",en:"The TGV to Lyon is delayed by twenty minutes."},
{c:"Vous",fr:"Le train a du retard ? C'est souvent comme ça ?",en:"The train is delayed? Does this happen often?"},
{c:"Véronique",fr:"Pas toujours. Vingt minutes, ce n'est pas trop long. Bon voyage !",en:"Not always. Twenty minutes isn't too long. Have a good trip!"},
]},
{day:"Ven",title:"Journée transport",focus:"Full day getting around",phrases:["J'ai perdu mon billet","Quelle direction ?","Le prochain ?"],
d:[
{c:"Sylvie",fr:"Le métro ? Tout droit, deux cents mètres. Direction Nation, ligne un.",en:"The métro? Straight ahead, two hundred metres. Direction Nation, line 1."},
{c:"Fabrice",fr:"Un ticket à l'unité, deux euros dix.",en:"A single ticket, two euros ten."},
{c:"Vous",fr:"Oh non, j'ai perdu mon carnet de tickets !",en:"Oh no, I've lost my book of tickets!"},
{c:"Fabrice",fr:"Ça arrive. Voilà votre ticket.",en:"It happens. Here's your ticket."},
{c:"Chloé",fr:"C'est bien le quai direction Nation. Le prochain dans trois minutes.",en:"This is the right platform for Nation. The next one in three minutes."},
{c:"Vous",fr:"Merci !",en:"Thanks!"},
{c:"Patrick",fr:"Vous descendez au prochain ? C'est le dernier avant le terminus.",en:"Getting off at the next stop? It's the last one before the terminus."},
{c:"Vous",fr:"Oui, c'est ici. Merci !",en:"Yes, this is it. Thanks!"},
{c:"Youssef",fr:"Au restaurant, rue de Rivoli ? En route !",en:"To the restaurant, rue de Rivoli? Let's go!"},
]}
]},
{week:6,title:"Faire les courses",sub:"Shopping & Errands",color:"#4A6741",sessions:[
{day:"Lun",title:"Au marché",focus:"Food market",phrases:["Un kilo de…","C'est mûr ?","Je peux goûter ?"],
d:[
{c:"Jean-Pierre",fr:"Les belles tomates ! Deux euros le kilo ! Bonjour monsieur !",en:"Beautiful tomatoes! Two euros a kilo! Hello sir!"},
{c:"Vous",fr:"Un kilo de tomates cerises, s'il vous plaît.",en:"A kilo of cherry tomatoes, please."},
{c:"Vous",fr:"Les pêches, elles sont mûres ?",en:"Are the peaches ripe?"},
{c:"Jean-Pierre",fr:"Mûres à point ! Goûtez-moi ça.",en:"Perfectly ripe! Try this."},
{c:"Vous",fr:"Mmm ! Je peux goûter une fraise aussi ?",en:"Mmm! Can I try a strawberry too?"},
{c:"Jean-Pierre",fr:"Servez-vous !",en:"Help yourself!"},
{c:"Vous",fr:"Une barquette de fraises et 500 grammes de pêches.",en:"A punnet of strawberries and 500 grams of peaches."},
{c:"Jean-Pierre",fr:"Dix euros cinquante le tout ! Et un brin de menthe en cadeau.",en:"Ten euros fifty altogether! And a sprig of mint as a gift."},
{c:"Vous",fr:"Merci, Jean-Pierre !",en:"Thanks, Jean-Pierre!"},
]},
{day:"Mar",title:"À la boulangerie",focus:"Bakery",phrases:["Baguette bien cuite","Deux croissants","Ce sera tout"],
d:[
{c:"Martine",fr:"Au suivant ! Bonjour, qu'est-ce que ce sera ?",en:"Next! Hello, what'll it be?"},
{c:"Vous",fr:"Une baguette tradition, bien cuite.",en:"A tradition baguette, well done."},
{c:"Martine",fr:"Et avec ceci ?",en:"And with that?"},
{c:"Vous",fr:"Deux croissants et un pain au chocolat.",en:"Two croissants and a pain au chocolat."},
{c:"Martine",fr:"Et avec ceci ?",en:"And with that?"},
{c:"Vous",fr:"Il vous reste du pain aux céréales ?",en:"Do you have any multigrain bread left?"},
{c:"Martine",fr:"Non, il faut venir plus tôt !",en:"No, you need to come earlier!"},
{c:"Vous",fr:"Ce sera tout alors. Combien ?",en:"That's all then. How much?"},
{c:"Martine",fr:"Cinq euros soixante-dix. Bonne journée !",en:"Five euros seventy. Good day!"},
]},
{day:"Mer",title:"À la pharmacie",focus:"Health basics",phrases:["Mal à la tête","Quelque chose contre…","Allergique à…"],
d:[
{c:"Dr. Legrand",fr:"Bonjour, je peux vous aider ?",en:"Hello, can I help you?"},
{c:"Vous",fr:"J'ai mal à la tête et mal à la gorge depuis hier.",en:"I've had a headache and sore throat since yesterday."},
{c:"Dr. Legrand",fr:"De la fièvre ?",en:"Any fever?"},
{c:"Vous",fr:"Non, pas de fièvre.",en:"No, no fever."},
{c:"Dr. Legrand",fr:"C'est peut-être la climatisation. Paracétamol et pastilles pour la gorge.",en:"It might be the air conditioning. Paracetamol and throat lozenges."},
{c:"Vous",fr:"Je suis allergique à la pénicilline, c'est un problème ?",en:"I'm allergic to penicillin, is that a problem?"},
{c:"Dr. Legrand",fr:"Non, aucun souci. Un comprimé toutes les six heures, pas plus de trois par jour.",en:"No, no problem. One tablet every six hours, no more than three a day."},
{c:"Vous",fr:"C'est sans ordonnance ?",en:"Is it over the counter?"},
{c:"Dr. Legrand",fr:"Oui. Neuf euros vingt. Bon rétablissement !",en:"Yes. Nine euros twenty. Get well soon!"},
]},
{day:"Jeu",title:"Petits achats",focus:"Gift shopping",phrases:["Cadeau pour…","Autres couleurs ?","Je le prends"],
d:[
{c:"Colette",fr:"Bonjour ! Je peux vous aider ?",en:"Hello! Can I help you?"},
{c:"Vous",fr:"Je cherche un cadeau pour ma femme. Un souvenir de Paris.",en:"I'm looking for a gift for my wife. A Paris souvenir."},
{c:"Colette",fr:"Regardez ces foulards en soie, fabriqués en France.",en:"Look at these silk scarves, made in France."},
{c:"Vous",fr:"Joli. Vous l'avez en d'autres couleurs ?",en:"Pretty. Do you have it in other colours?"},
{c:"Colette",fr:"Bleu marine, bordeaux et vert émeraude.",en:"Navy blue, burgundy and emerald green."},
{c:"Vous",fr:"Le bordeaux. C'est combien ?",en:"The burgundy. How much is it?"},
{c:"Colette",fr:"Quarante-cinq euros.",en:"Forty-five euros."},
{c:"Vous",fr:"C'est un peu cher pour mon budget...",en:"It's a bit expensive for my budget..."},
{c:"Colette",fr:"Si vous prenez deux articles, dix pour cent de réduction. On a des bracelets à vingt euros.",en:"If you take two items, ten percent off. We have bracelets at twenty euros."},
{c:"Vous",fr:"Le foulard et le bracelet doré. Je les prends !",en:"The scarf and the gold bracelet. I'll take them!"},
{c:"Colette",fr:"Cinquante-huit euros cinquante. Paquet cadeau ?",en:"Fifty-eight euros fifty. Gift wrap?"},
{c:"Vous",fr:"Oui, s'il vous plaît ! Merci.",en:"Yes, please! Thanks."},
]},
{day:"Ven",title:"Journée shopping",focus:"Full shopping day",phrases:["C'est pour offrir","Juste un tour","Bonne fin de journée"],
d:[
{c:"Martine",fr:"Bonjour ! Vite, qu'est-ce que ce sera ?",en:"Hello! Quick, what'll it be?"},
{c:"Vous",fr:"Une baguette et deux pains au chocolat.",en:"A baguette and two pains au chocolat."},
{c:"Martine",fr:"Quatre euros dix. Au suivant !",en:"Four euros ten. Next!"},
{c:"Jean-Pierre",fr:"Mon ami ! Les fraises étaient bonnes hier ?",en:"My friend! Were the strawberries good yesterday?"},
{c:"Vous",fr:"Extraordinaires ! Encore une barquette et un melon.",en:"Extraordinary! Another punnet and a melon."},
{c:"Jean-Pierre",fr:"Huit euros. Cadeau !",en:"Eight euros. My treat!"},
{c:"Dr. Legrand",fr:"Rebonjour ! La gorge va mieux ?",en:"Hello again! Is the throat better?"},
{c:"Vous",fr:"Oui ! Aujourd'hui, de la crème solaire.",en:"Yes! Today, some sunscreen."},
{c:"Dr. Legrand",fr:"Indice cinquante. Vingt-deux euros.",en:"SPF 50. Twenty-two euros."},
{c:"Colette",fr:"Vous revenez ! Votre femme a aimé le foulard ?",en:"You're back! Did your wife like the scarf?"},
{c:"Vous",fr:"Elle a adoré ! Aujourd'hui je fais juste un tour.",en:"She loved it! Today I'm just browsing."},
{c:"Colette",fr:"Bonne fin de journée !",en:"Have a good rest of the day!"},
]}
]},
{week:7,title:"Bavarder",sub:"Social Conversations",color:"#7B5EA7",sessions:[
{day:"Lun",title:"Tu fais quoi ?",focus:"Work & life",phrases:["Je travaille dans…","Ça te plaît ?","Du coup / En fait"],
d:[
{c:"Hélène",fr:"Salut ! Tu fais quoi dans la vie ?",en:"Hi! What do you do for a living?"},
{c:"Vous",fr:"En fait, je fais deux choses : consultant en admission et finance.",en:"Actually, I do two things: admissions consulting and finance."},
{c:"Hélène",fr:"Oh ! Ça te plaît ? C'est pas trop fatigant ?",en:"Oh! Do you enjoy it? Isn't it too tiring?"},
{c:"Vous",fr:"Ça dépend des périodes. Et toi ?",en:"It depends on the time of year. And you?"},
{c:"Hélène",fr:"Je suis éditrice chez Gallimard.",en:"I'm an editor at Gallimard."},
{c:"Vous",fr:"Impressionnant ! Ça te plaît ?",en:"Impressive! Do you enjoy it?"},
{c:"Hélène",fr:"J'adore. C'est parfois stressant, tu vois, mais du coup je ne me vois pas faire autre chose.",en:"I love it. It's sometimes stressful, you know, but because of that I can't see myself doing anything else."},
{c:"Vous",fr:"Tu travailles sur quel genre de livres ?",en:"What kind of books do you work on?"},
{c:"Hélène",fr:"De la littérature contemporaine. En ce moment, un premier roman. Passionnant !",en:"Contemporary literature. Right now, a debut novel. Fascinating!"},
]},
{day:"Mar",title:"J'aime bien…",focus:"Opinions",phrases:["Ce que j'aime bien…","Passionné(e) de…","Ça dépend"],
d:[
{c:"Nicolas",fr:"Tu es passionné de quoi, à part le boulot ?",en:"What are you passionate about, besides work?"},
{c:"Vous",fr:"Le café, le vin et le golf ! Le café artisanal, les origines, les torréfactions...",en:"Coffee, wine and golf! Artisan coffee, origins, roasting methods..."},
{c:"Hélène",fr:"Moi je ne suis pas fan de l'expresso. Trop fort. Je préfère le thé.",en:"I'm not a fan of espresso. Too strong. I prefer tea."},
{c:"Nicolas",fr:"L'expresso, c'est la base ! Mais le vin, je suis d'accord. Plutôt Bordeaux, moi.",en:"Espresso is essential! But wine, I agree. More of a Bordeaux person, me."},
{c:"Vous",fr:"Moi, je suis passionné de Bourgogne et de Champagne. Et le Rhône aussi.",en:"Me, I'm passionate about Burgundy and Champagne. And the Rhône too."},
{c:"Hélène",fr:"Ça dépend du plat, non ? Bourgogne avec fromage, Bordeaux avec viande...",en:"It depends on the dish, doesn't it? Burgundy with cheese, Bordeaux with meat..."},
{c:"Vous",fr:"Exactement ! Mais le Bourgogne a une finesse que j'adore.",en:"Exactly! But Burgundy has a finesse that I love."},
{c:"Nicolas",fr:"Chacun ses goûts ! Et le golf, c'est bien ?",en:"To each their own! And golf, is it good?"},
{c:"Vous",fr:"Très relaxant. Je joue au South Herts, près de Londres.",en:"Very relaxing. I play at South Herts, near London."},
]},
{day:"Mer",title:"Raconter un souvenir",focus:"Storytelling",phrases:["L'année dernière…","C'était incroyable","Tout à coup…"],
d:[
{c:"Hélène",fr:"C'est quoi le dernier voyage qui t'a marqué ?",en:"What's the last trip that really impressed you?"},
{c:"Vous",fr:"L'année dernière, je suis allé au Japon. C'était incroyable.",en:"Last year, I went to Japan. It was incredible."},
{c:"Hélène",fr:"Vous êtes allés où ?",en:"Where did you go?"},
{c:"Vous",fr:"Tokyo puis Kyoto. Il faisait beau, c'était la saison des cerisiers.",en:"Tokyo then Kyoto. The weather was beautiful, it was cherry blossom season."},
{c:"Hélène",fr:"Qu'est-ce qui t'a le plus impressionné ?",en:"What impressed you most?"},
{c:"Vous",fr:"Un petit restaurant de sushis, six places. Le chef préparait tout devant nous.",en:"A tiny sushi restaurant, six seats. The chef prepared everything in front of us."},
{c:"Hélène",fr:"Et alors ?",en:"And then?"},
{c:"Vous",fr:"Tout à coup, le chef nous a offert un saké très rare. Un moment magique.",en:"Suddenly, the chef gave us a very rare sake. A magical moment."},
{c:"Hélène",fr:"J'adore ! Moi, au Maroc, je me suis complètement perdue dans le souk.",en:"I love that! Me, in Morocco, I got completely lost in the souk."},
{c:"Vous",fr:"Le voyage crée les meilleurs souvenirs !",en:"Travel creates the best memories!"},
]},
{day:"Jeu",title:"Faire des projets",focus:"Making plans",phrases:["Ça te dit de… ?","On pourrait…","Ça marche !"],
d:[
{c:"Nicolas",fr:"Ça te dit de faire un truc ce week-end ?",en:"Feel like doing something this weekend?"},
{c:"Vous",fr:"Oui ! Tu proposes quoi ?",en:"Yes! What do you suggest?"},
{c:"Nicolas",fr:"On pourrait aller au musée de l'Orangerie samedi matin.",en:"We could go to the Orangerie museum Saturday morning."},
{c:"Vous",fr:"Samedi, je ne peux pas. Et dimanche ?",en:"Saturday I can't. What about Sunday?"},
{c:"Nicolas",fr:"Dimanche, parfait. On dit dix heures devant l'entrée ?",en:"Sunday, perfect. Shall we say 10am at the entrance?"},
{c:"Vous",fr:"Ça marche ! Et pour déjeuner, tu connais un bon endroit ?",en:"Sounds good! And for lunch, do you know a good place?"},
{c:"Nicolas",fr:"Un super bistrot à côté des Tuileries. Excellent plat du jour.",en:"A great bistrot near the Tuileries. Excellent daily special."},
{c:"Vous",fr:"Génial ! Et l'après-midi, on se promène dans les Tuileries si il fait beau.",en:"Great! And in the afternoon, we walk in the Tuileries if the weather's nice."},
{c:"Nicolas",fr:"C'est parti ! Je t'envoie l'adresse. À dimanche !",en:"Let's do it! I'll send you the address. See you Sunday!"},
]},
{day:"Ven",title:"Soirée entre amis",focus:"Full social evening",phrases:["Figure-toi que…","Ça m'a fait rire","On se redit ?"],
d:[
{c:"Hélène",fr:"Question sérieuse : c'est quoi le meilleur quartier de Paris ?",en:"Serious question: what's the best neighbourhood in Paris?"},
{c:"Nicolas",fr:"Le Marais, sans hésiter.",en:"Le Marais, without a doubt."},
{c:"Hélène",fr:"Trop touristique ! Le onzième, Oberkampf. Plus authentique.",en:"Too touristy! The 11th, Oberkampf. More authentic."},
{c:"Vous",fr:"Moi j'adore Saint-Germain. L'ambiance littéraire, les cafés historiques.",en:"I love Saint-Germain. The literary atmosphere, the historic cafés."},
{c:"Nicolas",fr:"Les prix, par contre !",en:"The prices, though!"},
{c:"Hélène",fr:"Figure-toi que Nicolas a vu un violoncelliste dans le métro. Tout le wagon s'est arrêté.",en:"Would you believe Nicolas saw a cellist in the métro. The whole carriage stopped."},
{c:"Vous",fr:"Ça m'a fait rire l'autre jour : un homme promenait un chat en laisse aux Tuileries.",en:"It made me laugh the other day: a man was walking a cat on a leash in the Tuileries."},
{c:"Hélène",fr:"On devrait organiser Giverny, les jardins de Monet !",en:"We should plan Giverny, Monet's gardens!"},
{c:"Vous",fr:"J'adorerais ! On se redit pour une date ?",en:"I'd love that! Shall we confirm a date?"},
{c:"Nicolas",fr:"Allez, à très bientôt !",en:"See you very soon!"},
{c:"Vous",fr:"C'était super. À bientôt !",en:"It was great. See you soon!"},
]}
]},
{week:8,title:"Tout ensemble",sub:"Full Scenarios",color:"#C4A35A",sessions:[
{day:"Lun",title:"Premier jour",focus:"Arrival day",phrases:["All Weeks 1-4"],
d:[
{c:"Hassan",fr:"Première fois à Paris ?",en:"First time in Paris?"},
{c:"Vous",fr:"Non, mais ça fait longtemps. Content d'être de retour.",en:"No, but it's been a while. Happy to be back."},
{c:"Nathalie",fr:"Bienvenue ! Votre chambre est prête, avec vue sur le jardin.",en:"Welcome! Your room is ready, with a garden view."},
{c:"Vous",fr:"Vous connaissez un bon café dans le quartier ?",en:"Do you know a good café in the area?"},
{c:"Olivier",fr:"Le Café Procope, à cinq minutes. Le plus ancien café de Paris !",en:"Café Procope, five minutes away. The oldest café in Paris!"},
{c:"Émilie",fr:"Bonsoir ! Qu'est-ce que je vous sers ?",en:"Good evening! What can I get you?"},
{c:"Vous",fr:"Un expresso et une tarte aux pommes.",en:"An espresso and an apple tart."},
{c:"Marc",fr:"La tarte ici est exceptionnelle. Vous venez souvent ?",en:"The tart here is exceptional. Do you come often?"},
{c:"Vous",fr:"C'est ma première fois. C'est magnifique ici.",en:"It's my first time. It's beautiful here."},
]},
{day:"Mar",title:"Explorer",focus:"Getting around",phrases:["Pardon, je voulais dire…","Comment on dit… ?"],
d:[
{c:"Nathalie",fr:"Pour le musée Rodin, ligne treize. Trois arrêts, station Varenne.",en:"For the Rodin museum, line 13. Three stops, Varenne station."},
{c:"Fabrice",fr:"Un ticket, deux euros dix.",en:"One ticket, two euros ten."},
{c:"Chloé",fr:"Bonne direction ! Varenne, c'est la prochaine.",en:"Right direction! Varenne is the next one."},
{c:"Raphaël",fr:"Bonsoir ! Vous avez choisi ?",en:"Good evening! Have you decided?"},
{c:"Vous",fr:"Le... comment on dit « lamb » en français ?",en:"The... how do you say 'lamb' in French?"},
{c:"Raphaël",fr:"L'agneau !",en:"Lamb!"},
{c:"Vous",fr:"Pardon, je voulais dire l'agneau grillé.",en:"Sorry, I meant the grilled lamb."},
{c:"Dominique",fr:"Avec l'agneau, un Côtes-du-Rhône ? Fruité et épicé.",en:"With the lamb, a Côtes-du-Rhône? Fruity and spicy."},
{c:"Vous",fr:"Parfait, un verre s'il vous plaît.",en:"Perfect, a glass please."},
]},
{day:"Mer",title:"Imprévu !",focus:"Unexpected situations",phrases:["Perdu mon portefeuille","C'est urgent","Vous pouvez m'aider ?"],
d:[
{c:"Vous",fr:"Mon portefeuille ! Excusez-moi, vous pouvez m'aider ? Je l'ai perdu dans le métro.",en:"My wallet! Excuse me, can you help me? I lost it in the métro."},
{c:"Sylvie",fr:"Oh là là ! Il y a un commissariat à deux rues d'ici. Je vous accompagne.",en:"Oh dear! There's a police station two streets from here. I'll go with you."},
{c:"Commandant Dupont",fr:"Qu'est-ce qui vous arrive ?",en:"What happened to you?"},
{c:"Vous",fr:"J'ai perdu mon portefeuille. Carte bancaire, cent euros en espèces.",en:"I lost my wallet. Bank card, a hundred euros in cash."},
{c:"Commandant Dupont",fr:"Vous avez votre passeport ?",en:"Do you have your passport?"},
{c:"Vous",fr:"Oui, dans le coffre de l'hôtel, heureusement.",en:"Yes, in the hotel safe, fortunately."},
{c:"Nathalie",fr:"Ne vous inquiétez pas. On met tout sur votre compte, vous réglez au départ.",en:"Don't worry. We'll put everything on your account, you settle on departure."},
{c:"Paul",fr:"Si vous avez besoin d'appeler votre banque, je vous prête mon téléphone.",en:"If you need to call your bank, I can lend you my phone."},
{c:"Vous",fr:"Merci, c'est vraiment gentil !",en:"Thanks, that's really kind!"},
]},
{day:"Jeu",title:"Le dernier soir",focus:"Farewells",phrases:["Merci pour tout","Ça m'a fait plaisir","On garde le contact ?"],
d:[
{c:"Hélène",fr:"Ton dernier soir ! C'est passé tellement vite.",en:"Your last evening! It went so fast."},
{c:"Nicolas",fr:"Quel est ton meilleur souvenir ?",en:"What's your best memory?"},
{c:"Vous",fr:"La soirée chez Hélène. Et la sole meunière chez François.",en:"The evening at Hélène's. And the sole meunière at François's."},
{c:"Hélène",fr:"Ça me fait plaisir !",en:"That makes me happy!"},
{c:"Nicolas",fr:"On garde le contact, hein ? Tu reviens quand tu veux.",en:"We'll stay in touch, yeah? Come back whenever you want."},
{c:"Vous",fr:"Bien sûr ! Et vous êtes les bienvenus à Londres.",en:"Of course! And you're welcome in London."},
{c:"Raphaël",fr:"Oh, c'est vous ! Vous repartez demain ?",en:"Oh, it's you! Leaving tomorrow?"},
{c:"Vous",fr:"Oui, la cuisine ici va me manquer. Merci pour tout.",en:"Yes, I'll miss the food here. Thanks for everything."},
{c:"Hélène",fr:"À la prochaine, Mitchell. Bon retour !",en:"Until next time, Mitchell. Safe journey home!"},
{c:"Nicolas",fr:"Pense à Giverny au printemps !",en:"Think about Giverny in spring!"},
{c:"Vous",fr:"Promis ! À très bientôt !",en:"Promise! See you very soon!"},
]},
{day:"Ven",title:"Le grand final",focus:"Everything combined",phrases:["All 8 weeks"],
d:[
{c:"Narrateur",fr:"Montage final : huit rencontres qui résument votre voyage.",en:"Final montage: eight encounters that sum up your trip."},
{c:"Marie",fr:"Enchanté ! Vous venez d'où ?",en:"Nice to meet you! Where are you from?"},
{c:"Vous",fr:"De Hong Kong. Moi, c'est Mitchell.",en:"From Hong Kong. I'm Mitchell."},
{c:"Lucas",fr:"Qu'est-ce que je vous sers ?",en:"What can I get you?"},
{c:"Vous",fr:"Un café crème, en terrasse.",en:"A café crème, on the terrace."},
{c:"Isabelle",fr:"Pour combien de personnes ?",en:"For how many people?"},
{c:"Vous",fr:"Deux, à vingt heures, au nom de Mitchell.",en:"Two, at 8pm, under Mitchell."},
{c:"Nathalie",fr:"La clim ne marche pas ?",en:"The AC isn't working?"},
{c:"Vous",fr:"Serait-il possible de changer de chambre ?",en:"Would it be possible to change rooms?"},
{c:"Sylvie",fr:"Le musée ? Tout droit, puis à gauche.",en:"The museum? Straight ahead, then left."},
{c:"Véronique",fr:"Un aller-retour, seconde classe ?",en:"A round trip, second class?"},
{c:"Hélène",fr:"Qu'est-ce que tu aimes le plus à Paris ?",en:"What do you like most about Paris?"},
{c:"Vous",fr:"Le vin, les cafés, et les conversations comme celle-ci.",en:"The wine, the cafés, and conversations like this one."},
{c:"Nicolas",fr:"Allez, à la prochaine !",en:"See you next time!"},
{c:"Vous",fr:"Merci pour tout. À très bientôt !",en:"Thanks for everything. See you very soon!"},
{c:"Narrateur",fr:"Bravo ! Vous avez terminé les huit semaines. Votre français est prêt pour le voyage !",en:"Bravo! You've completed all eight weeks. Your French is ready for travel!"},
]}
]}
];

// ── Voice ──
const PR={}; let pc=0;
const PT=[0.82,0.92,1.0,1.08,1.18,1.3,0.88,1.12];
const RO=[-0.05,0.02,0,-0.03,0.04,-0.06,0.03,-0.02];
function gp(n){if(PR[n])return PR[n];const i=pc%PT.length;PR[n]={p:PT[i],r:RO[i]};pc++;return PR[n];}
let _v=[],_vl=false;
function lv(){return new Promise(r=>{const s=()=>{_v=(window.speechSynthesis?.getVoices()||[]).filter(v=>v.lang.startsWith("fr"));_vl=true;r(_v);};if((window.speechSynthesis?.getVoices()||[]).length>0){s();return;}window.speechSynthesis?.addEventListener?.("voiceschanged",s,{once:true});setTimeout(s,1500);});}
function pv(pr){if(_v.length<=1)return _v[0]||null;return _v[Math.round((pr.p-0.8)*10)%_v.length]||_v[0];}
function sp(t,r,p,v){return new Promise(rs=>{if(!window.speechSynthesis){rs();return;}const c=t.replace(/\(.*?\)/gs,"").replace(/\[.*?\]/gs,"").trim();if(!c){rs();return;}const u=new SpeechSynthesisUtterance(c);u.lang="fr-FR";u.rate=Math.max(0.4,Math.min(r,1.5));u.pitch=Math.max(0.5,Math.min(p,2));if(v)u.voice=v;const k=setInterval(()=>{if(!window.speechSynthesis.speaking){clearInterval(k);return;}window.speechSynthesis.pause();window.speechSynthesis.resume();},10000);u.onend=()=>{clearInterval(k);rs();};u.onerror=()=>{clearInterval(k);rs();};window.speechSynthesis.speak(u);});}
function st(){window.speechSynthesis?.cancel();}
const CL=["#1B4332","#8B1A1A","#2C3E6B","#6B4226","#7B5EA7","#5C4033","#4A6741","#C4A35A","#D4456A","#2A7B9B"];
const cm={};let ci=0;
function cc(n){if(!n)return"var(--muted)";if(n==="Narrateur")return"var(--muted)";if(n==="Vous")return"var(--accent)";if(n==="Annonce SNCF")return"#B91C1C";if(cm[n])return cm[n];cm[n]=CL[ci%CL.length];ci++;return cm[n];}

export default function App(){
  const[sW,setSW]=useState(null);
  const[sS,setSS]=useState(0);
  const[on,setOn]=useState(false);
  const[pl,setPl]=useState(false);
  const[ai,setAi]=useState(-1);
  const[spd,setSpd]=useState("normal");
  const[dn,setDn]=useState({});
  const[showEn,setShowEn]=useState(true);
  const sr=useRef(null);
  const stR=useRef(false);

  useEffect(()=>{lv();},[]);
  useEffect(()=>{if(ai>=0&&sr.current){const e=sr.current.querySelector(`[data-i="${ai}"]`);e?.scrollIntoView({behavior:"smooth",block:"center"});}},[ai]);

  const br=spd==="slow"?0.6:0.88;
  const w=sW!==null?W[sW]:null;
  const s=w?w.sessions[sS]:null;
  const ln=s?s.d:[];

  const playAll=useCallback(async(f=0)=>{
    if(!ln.length)return;setPl(true);stR.current=false;
    for(let i=f;i<ln.length;i++){
      if(stR.current)break;setAi(i);
      const l=ln[i],isN=l.c==="Narrateur",pr=l.c?gp(l.c):{p:.95,r:0};
      await sp(l.fr,br+(isN?-.05:pr.r),isN?.95:pr.p,pv(pr));
      if(!stR.current)await new Promise(r=>setTimeout(r,500));
    }
    setPl(false);if(!stR.current)setAi(-1);
  },[ln,br]);

  // Auto-play when entering player
  useEffect(()=>{
    if(on&&ln.length>0&&!pl){
      const t=setTimeout(()=>playAll(0),600);
      return()=>clearTimeout(t);
    }
  },[on]);

  const stp=()=>{stR.current=true;st();setPl(false);};
  const wp=i=>{const t=W[i].sessions.length;return{d:W[i].sessions.filter((_,j)=>dn[`${i}-${j}`]).length,t};};
  const td=Object.values(dn).filter(Boolean).length;

  return(
    <div style={{fontFamily:"'Libre Baskerville',Georgia,serif",minHeight:"100vh",background:"var(--bg)",color:"var(--text)",display:"flex",flexDirection:"column"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
        :root{--bg:#FAF7F2;--text:#2A2520;--muted:#8A8078;--border:#E5DDD4;--card:#FFF;--accent:#1B4332}
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .wc{border:1px solid var(--border);border-radius:10px;padding:14px 18px;cursor:pointer;transition:all .2s;background:var(--card)}.wc:hover{transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,0,0,.06)}
        .sp{padding:7px 14px;border-radius:6px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;border:1px solid var(--border);background:var(--card);color:var(--text);transition:all .15s;white-space:nowrap}.sp:hover{border-color:var(--accent)}.sp.on{background:var(--accent);color:#fff;border-color:var(--accent)}
        .ph{display:inline-block;padding:5px 11px;border-radius:16px;background:var(--card);border:1px solid var(--border);font-size:12px;margin:2px 3px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .15s}.ph:hover{border-color:var(--accent);color:var(--accent)}
        .bar{height:3px;background:var(--border);border-radius:2px;overflow:hidden}.fl{height:100%;border-radius:2px;transition:width .4s}
        .bb{background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--muted);padding:4px 0}.bb:hover{color:var(--text)}
        .go{padding:14px;border-radius:10px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;background:var(--accent);color:#fff;width:100%}.go:hover{opacity:.9}
        .ct{padding:5px 10px;border-radius:6px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;border:1px solid var(--border);background:var(--card);color:var(--muted);transition:all .15s}.ct:hover{border-color:var(--accent);color:var(--accent)}.ct.on{background:var(--accent);color:#fff;border-color:var(--accent)}
        .ck{width:28px;height:28px;border-radius:50%;border:2px solid var(--border);background:var(--card);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}.ck.on{background:var(--accent);border-color:var(--accent);color:#fff}
        .lr{padding:10px 14px;border-radius:10px;margin-bottom:4px;transition:all .3s;cursor:pointer;border-left:3px solid transparent}.lr:hover{background:var(--card)}.lr.ac{background:var(--card);box-shadow:0 2px 8px rgba(0,0,0,.06)}
        .pf{width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;font-size:22px;display:flex;align-items:center;justify-content:center;background:var(--accent);color:#fff;box-shadow:0 4px 14px rgba(0,0,0,.15);transition:all .2s}.pf:hover{transform:scale(1.05)}.pf.st{background:#E53E3E}
      `}</style>

      <div style={{padding:"20px 20px 14px",borderBottom:"1px solid var(--border)",flexShrink:0}}>
        {on?(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <button className="bb" onClick={()=>{stp();setOn(false);setAi(-1);}} style={{fontSize:16}}>←</button>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,letterSpacing:".08em",color:w.color,textTransform:"uppercase"}}>Semaine {w.week} · {s.day}</div>
                <div style={{fontSize:14,fontWeight:700}}>{s.title}</div>
              </div>
              {ai>=0&&<span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"var(--muted)"}}>{ai+1}/{ln.length}</span>}
            </div>
            <div style={{display:"flex",gap:5}}>
              <button className={`ct ${spd==="slow"?"on":""}`} onClick={()=>setSpd(p=>p==="normal"?"slow":"normal")}>{spd==="slow"?"🐢 Lent":"🐇 Normal"}</button>
              <button className={`ct ${showEn?"on":""}`} onClick={()=>setShowEn(p=>!p)}>🇬🇧 English</button>
            </div>
          </div>
        ):sW!==null?(
          <div>
            <button className="bb" onClick={()=>setSW(null)}>← All weeks</button>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,letterSpacing:".08em",color:w.color,textTransform:"uppercase",marginTop:8}}>Semaine {w.week} · {w.sub}</div>
            <h2 style={{fontSize:19,fontWeight:700}}>{w.title}</h2>
          </div>
        ):(
          <div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",color:"var(--muted)",marginBottom:2}}>Cours de français · 8 semaines</div>
            <h1 style={{fontSize:20,fontWeight:700}}>Rafraîchir son français</h1>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"var(--muted)",marginTop:2}}>40 audio dialogues · {td}/40 done</div>
            <div className="bar" style={{marginTop:8}}><div className="fl" style={{width:`${(td/40)*100}%`,background:"var(--accent)"}}/></div>
          </div>
        )}
      </div>

      {on?(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
          <div ref={sr} style={{flex:1,overflowY:"auto",padding:"12px 16px 120px"}}>
            <div style={{marginBottom:12,padding:"8px 10px",borderRadius:8,background:"var(--card)",border:"1px solid var(--border)"}}>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",color:"var(--muted)",marginBottom:4}}>Key phrases · tap to hear</div>
              <div style={{display:"flex",flexWrap:"wrap"}}>{s.phrases.map((p,i)=><span key={i} className="ph" onClick={()=>{st();sp(p,br,1,_v[0]);}}>{p}</span>)}</div>
            </div>
            {ln.map((l,i)=>{const isN=l.c==="Narrateur",isV=l.c==="Vous",col=cc(l.c);return(
              <div key={i} data-i={i} className={`lr ${ai===i?"ac":""}`} style={{borderLeftColor:ai===i?col:"transparent"}}
                onClick={()=>{stp();setAi(i);const pr=l.c?gp(l.c):{p:.95,r:0};sp(l.fr,br+(isN?-.05:pr.r),isN?.95:pr.p,pv(pr));}}>
                {l.c&&<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",color:col,marginBottom:1}}>{isV?"🎧 YOU":isN?"📖":l.c==="Annonce SNCF"?"📢 "+l.c:"🗣️ "+l.c}</div>}
                <div style={{fontFamily:isN?"'Libre Baskerville',serif":"'DM Sans',sans-serif",fontSize:isN?12.5:13.5,lineHeight:1.55,color:ai===i?"var(--text)":(isN?"var(--muted)":"var(--text)"),opacity:ai>=0&&ai!==i?.35:1,transition:"opacity .3s",fontStyle:isN?"italic":"normal"}}>{l.fr}</div>
                {showEn&&<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"var(--muted)",marginTop:2,opacity:ai>=0&&ai!==i?.25:.7,transition:"opacity .3s"}}>{l.en}</div>}
              </div>
            );})}
          </div>
          <div style={{position:"absolute",bottom:20,left:0,right:0,display:"flex",justifyContent:"center",gap:10,alignItems:"center",pointerEvents:"none"}}>
            <button className="ct" style={{pointerEvents:"auto",background:"var(--card)",boxShadow:"0 2px 8px rgba(0,0,0,.1)"}} onClick={()=>{stp();setTimeout(()=>playAll(0),100);}}>⏮</button>
            <button className={`pf ${pl?"st":""}`} style={{pointerEvents:"auto"}} onClick={()=>{if(pl)stp();else playAll(ai>=0?ai:0);}}>{pl?"⏹":"▶"}</button>
            <button className="ct" style={{pointerEvents:"auto",background:"var(--card)",boxShadow:"0 2px 8px rgba(0,0,0,.1)"}} onClick={()=>{const k=`${sW}-${sS}`;setDn(p=>({...p,[k]:!p[k]}));}}>{dn[`${sW}-${sS}`]?"✓":"☐"}</button>
          </div>
        </div>
      ):sW!==null?(
        <div style={{flex:1,overflowY:"auto",padding:"14px 20px"}}>
          <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
            {w.sessions.map((x,i)=><button key={i} className={`sp ${sS===i?"on":""}`} onClick={()=>setSS(i)}>{x.day}</button>)}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div><h3 style={{fontSize:16,fontWeight:700}}>{s.title}</h3><div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"var(--muted)",marginTop:2}}>{s.focus}</div></div>
            <button className={`ck ${dn[`${sW}-${sS}`]?"on":""}`} onClick={()=>{const k=`${sW}-${sS}`;setDn(p=>({...p,[k]:!p[k]}));}}>{dn[`${sW}-${sS}`]?"✓":""}</button>
          </div>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",color:"var(--muted)",marginBottom:4}}>Phrases · tap 🔊</div>
          <div style={{display:"flex",flexWrap:"wrap",marginBottom:14}}>{s.phrases.map((p,i)=><span key={i} className="ph" onClick={()=>sp(p,.88,1,_v[0])}>{p}</span>)}</div>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",color:"var(--muted)",marginBottom:4}}>Preview · {ln.length} lines</div>
          <div style={{padding:"10px 12px",borderRadius:8,background:"var(--card)",border:"1px solid var(--border)",marginBottom:16,fontFamily:"'DM Sans',sans-serif",fontSize:12.5,lineHeight:1.6}}>
            {ln.slice(0,3).map((l,i)=><div key={i} style={{marginBottom:4}}><strong style={{color:cc(l.c),fontSize:10}}>{l.c}</strong> <span style={{color:"var(--text)"}}>{l.fr}</span><br/><span style={{color:"var(--muted)",fontSize:11}}>{l.en}</span></div>)}
            <div style={{color:"var(--border)",fontSize:11}}>… {ln.length-3} more lines</div>
          </div>
          <button className="go" onClick={()=>{Object.keys(cm).forEach(k=>delete cm[k]);ci=0;Object.keys(PR).forEach(k=>delete PR[k]);pc=0;setOn(true);setAi(-1);}}>▶ Play dialogue</button>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:16,fontFamily:"'DM Sans',sans-serif",fontSize:13}}>
            <button className="bb" disabled={sS===0} style={{color:sS>0?"var(--accent)":"var(--border)"}} onClick={()=>setSS(p=>p-1)}>← Prev</button>
            <button className="bb" disabled={sS===w.sessions.length-1&&sW===7} style={{color:(sS<w.sessions.length-1||sW<7)?"var(--accent)":"var(--border)"}}
              onClick={()=>{if(sS<w.sessions.length-1)setSS(p=>p+1);else if(sW<7){setSW(p=>p+1);setSS(0);}}}>Next →</button>
          </div>
        </div>
      ):(
        <div style={{flex:1,overflowY:"auto",padding:"14px 20px"}}>
          {W.map((x,i)=>{const p=wp(i);return(
            <div key={i} className="wc" style={{marginBottom:8}} onClick={()=>{setSW(i);setSS(0);}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",color:x.color}}>Semaine {x.week}</div>
                  <div style={{fontSize:14,fontWeight:700,marginTop:1}}>{x.title}</div>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"var(--muted)"}}>{x.sub}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"var(--muted)"}}>{p.d}/{p.t}</div>
                  <div className="bar" style={{width:45,marginTop:3}}><div className="fl" style={{width:`${(p.d/p.t)*100}%`,background:x.color}}/></div>
                </div>
              </div>
              <div style={{display:"flex",gap:4,marginTop:6}}>
                {x.sessions.map((ss,si)=><div key={si} style={{width:22,height:22,borderRadius:"50%",fontSize:9,fontFamily:"'DM Sans',sans-serif",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",background:dn[`${i}-${si}`]?x.color:"transparent",color:dn[`${i}-${si}`]?"#fff":"var(--muted)",border:`1.5px solid ${dn[`${i}-${si}`]?x.color:"var(--border)"}`}}>{ss.day.charAt(0)}</div>)}
              </div>
            </div>
          );})}
        </div>
      )}
    </div>
  );
}
