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
        <h2>${categoryIcons[category.title] || ''} ${category.title}</h2>
        <ul>
          ${category.rules.map(rule =>
            `<li><strong>${rule.title}</strong> — ${rule.desc}</li>`
          ).join('')}
        </ul>
      `;
      container.appendChild(card);
    });
});