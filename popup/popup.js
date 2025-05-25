document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['lastCheck', 'games'], (data) => {
    const gamesContainer = document.getElementById('games');
    const status = document.getElementById('status');
    const lastCheck = document.getElementById('lastCheck');

    if (data.games?.length > 0) {
      status.textContent = `Now available: ${data.games.length}`;
      gamesContainer.innerHTML = data.games
        .map(game => `
          <div class="game">
            <a href="${game.url}" target="_blank">${game.title}</a>
            <div class="time">Until ${new Date(game.endDate).toLocaleDateString()}</div>
          </div>
        `).join('');
    } else {
      status.textContent = 'There are no new games';
    }

    lastCheck.textContent = `Last check: ${
      data.lastCheck ? new Date(data.lastCheck).toLocaleString() : 'never'
    }`;
  });
});