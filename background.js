const API_URL = "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=ru";
const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24h

function isValidGame(game) {
  const currentDate = new Date();
  return (
    game.productSlug &&
    !game.title.toLowerCase().includes('mystery') && // exclude future games
    game.price?.totalPrice?.discountPrice === 0 &&
    new Date(game.effectiveDate) <= currentDate &&
    game.offerType !== 'EDITION'
  );
}

async function checkGames() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const freeGames = data.data.Catalog.searchStore.elements
      .filter(isValidGame)
      .map(game => ({
        title: game.title,
        url: `https://store.epicgames.com/en/p/${game.productSlug}`,
        endDate: game.promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0]?.endDate || 
        game.promotions?.upcomingPromotionalOffers?.[0]?.promotionalOffers?.[0]?.endDate
      }));

    chrome.storage.local.get(['lastCheck', 'games'], (result) => {
      const prevGames = result.games || [];
      const isNew = JSON.stringify(freeGames) !== JSON.stringify(prevGames);
      
      chrome.storage.local.set({
        lastCheck: new Date().toISOString(),
        games: freeGames
      });

      if (isNew && freeGames.length > 0) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon.png',
          title: 'New free games available!',
          message: `Available: ${freeGames.length}`
        });
      }
    });
  } catch (error) {
    console.error('Epic Games Monitor Error:', error);
  }
}

// Инициализация
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('epicCheck', {
    periodInMinutes: 24 * 60 // 24 часа
  });
  checkGames();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'epicCheck') checkGames();
});