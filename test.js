import fetch from 'node-fetch';

const API_URL = "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US";

async function checkGames() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    const freeGames = data.data.Catalog.searchStore.elements
      .filter(game => 
        game.productSlug &&
        !game.title.toLowerCase().includes('mystery') &&
        game.price?.totalPrice?.discountPrice === 0
      )
      .map(game => ({
        title: game.title,
        url: `https://store.epicgames.com/p/${game.productSlug}`,
        endDate: game.promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0]?.endDate
      }));

    console.log('✅ Found free games:', freeGames.length);
    console.log(freeGames);
    return freeGames;

  } catch (error) {
    console.error('❌ Error:', error.message);
    return [];
  }
}

checkGames();