const categoryIcons = {
  "General": "🧭",
  "Gameplay": "🎮",
  "Building": "🏗️",
  "Shops & Economy": "💎",
  "Creative Dimension": "🧪",
  "Community": "🤝"
};

fetch('rules.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('rules-container');
    data.forEach(category => {
      const slug = category.title
        .toLowerCase()
        .replace(/&/g, '')
        .replace(/\s+/g, '-');
      const card = document.createElement('div');
      card.className = `card ${slug}`;

      card.innerHTML = `
        <h2 class="collapsible-header">
          <span class="toggle-icon">▼</span>
          ${categoryIcons[category.title] || ''} ${category.title}
        </h2>
        <div class="rules-content">
          <ul>
            ${category.rules.map(rule =>
              `<li><strong>${rule.title}</strong> — ${rule.desc}</li>`
            ).join('')}
          </ul>
        </div>
      `;
      container.appendChild(card);

      // Add click handler
      const header = card.querySelector('.collapsible-header');
      const content = card.querySelector('.rules-content');
      const icon = card.querySelector('.toggle-icon');

      header.addEventListener('click', () => {
        content.classList.toggle('collapsed');
        icon.textContent = content.classList.contains('collapsed') ? '▶' : '▼';
      });
    });
});