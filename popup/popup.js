document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['lastCheck', 'games'], (data) => {
    const gamesContainer = document.getElementById('games');
    const status = document.getElementById('status');
    const lastCheck = document.getElementById('lastCheck');

    while (gamesContainer.firstChild) {
      gamesContainer.removeChild(gamesContainer.firstChild);
    }

    if (data.games?.length > 0) {
      status.textContent = `Now available: ${data.games.length}`;
      
      data.games.forEach(game => {
        const gameDiv = document.createElement('div');
        gameDiv.className = 'game';

        const link = document.createElement('a');
        link.textContent = game.title;
        link.href = game.url;
        link.target = '_blank';

        const timeDiv = document.createElement('div');
        timeDiv.className = 'time';
        timeDiv.textContent = `Until ${new Date(game.endDate).toLocaleDateString()}`;

        gameDiv.appendChild(link);
        gameDiv.appendChild(timeDiv);
        gamesContainer.appendChild(gameDiv);
      });
    } else {
      status.textContent = 'There are no new games';
    }

    lastCheck.textContent = `Last check: ${
      data.lastCheck ? new Date(data.lastCheck).toLocaleString() : 'never'
    }`;
  });
});