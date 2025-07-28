const dealCards = (users) => {
  const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const cardValues = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
  const gameCards = {};

  // Deal one card to each user
  users.forEach((user) => {
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    gameCards[user] = randomCard;
  });

  // Determine the winner (highest card value)
  let winner = null;
  let maxValue = -1;
  Object.entries(gameCards).forEach(([user, card]) => {
    if (cardValues[card] > maxValue) {
      maxValue = cardValues[card];
      winner = user;
    }
  });

  return { cards: gameCards, winner };
};

module.exports = { dealCards };