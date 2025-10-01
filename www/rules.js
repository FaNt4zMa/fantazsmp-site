const categoryIcons = {
  "General": "🧭",
  "Gameplay": "🎮",
  "Building": "🏗️",
  "Shops & Economy": "💎",
  "Creative Dimension": "🧪",
  "Community": "🤝"
};

// Get saved states from localStorage
function getCollapsedStates() {
  const saved = localStorage.getItem('rulesCollapsed');
  return saved ? JSON.parse(saved) : {};
}

// Save states to localStorage
function saveCollapsedState(slug, isCollapsed) {
  const states = getCollapsedStates();
  states[slug] = isCollapsed;
  localStorage.setItem('rulesCollapsed', JSON.stringify(states));
}

fetch('rules.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('rules-container');
    const savedStates = getCollapsedStates();
    
    data.forEach(category => {
      const slug = category.title
        .toLowerCase()
        .replace(/&/g, '')
        .replace(/\s+/g, '-');
      const card = document.createElement('div');
      card.className = `card ${slug}`;

      // Start collapsed by default, unless user previously expanded it
      const isCollapsed = savedStates[slug] !== false; // Default to collapsed
      const rightArrow = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>';
      const downArrow = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>';
      const iconHtml = isCollapsed ? rightArrow : downArrow;
      const collapsedClass = isCollapsed ? ' collapsed' : '';

      card.innerHTML = `
        <h2 class="collapsible-header">
          <span class="toggle-icon">${iconHtml}</span>
          ${categoryIcons[category.title] || ''} ${category.title}
        </h2>
        <div class="rules-content${collapsedClass}">
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
        const willBeCollapsed = !content.classList.contains('collapsed');
        content.classList.toggle('collapsed');

        // Update icon
        const rightArrow = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>';
        const downArrow = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>';
        icon.innerHTML = willBeCollapsed ? rightArrow : downArrow;
        
        // Save state to localStorage
        saveCollapsedState(slug, willBeCollapsed);
      });
    });
});