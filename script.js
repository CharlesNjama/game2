document.addEventListener('DOMContentLoaded', () => {
    const gameGrid = document.getElementById('gameGrid');
    const heroSection = document.getElementById('heroSection');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');

    let allGames = [];

    // Fetch games data
    fetch('games.json')
        .then(response => response.json())
        .then(games => {
            allGames = games;
            renderFeatured(games);
            renderGames(games);
        })
        .catch(error => console.error("Error loading games:", error));

    // Render Featured snippet (Hero)
    function renderFeatured(games) {
        const featuredGame = games.find(g => g.featured) || games[0];
        if (!featuredGame) return;

        heroSection.innerHTML = `
            <div class="hero-content">
                <h2>${featuredGame.title}</h2>
                <p>Play our most popular game right now.</p>
                <a href="play.html?id=${featuredGame.id}" class="play-now-btn">Play Now</a>
            </div>
            <div class="hero-bg" style="background-image: url('${featuredGame.thumbnail}')"></div>
        `;
    }

    // Render grid of games
    function renderGames(games) {
        gameGrid.innerHTML = '';
        if (games.length === 0) {
            gameGrid.innerHTML = '<p class="no-results">No games found.</p>';
            return;
        }

        games.forEach(game => {
            const card = document.createElement('a');
            card.href = `play.html?id=${game.id}`;
            card.className = 'game-card';
            
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${game.thumbnail}" alt="${game.title}" loading="lazy">
                    <div class="play-overlay">
                        <span class="play-icon">▶</span>
                    </div>
                </div>
                <div class="card-info">
                    <h3>${game.title}</h3>
                    <span class="category-tag">${game.category}</span>
                </div>
            `;
            gameGrid.appendChild(card);
        });
    }

    // Filtering logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;
            filterGames(category, searchInput.value);
        });
    });

    // Search logic
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
        filterGames(activeCategory, searchTerm);
    });

    function filterGames(category, searchTerm) {
        let filtered = allGames;

        // Filter by category
        if (category !== 'all') {
            filtered = filtered.filter(g => g.category === category);
        }

        // Filter by search term
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(g => g.title.toLowerCase().includes(lowerTerm));
        }

        renderGames(filtered);
    }
});
