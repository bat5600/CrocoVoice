const menu = document.getElementById('trayMenu');
const toggleButton = document.getElementById('trayToggleButton');

const PADDING = 12;

function positionMenu(payload) {
  if (!menu || !payload) {
    return;
  }
  const { trayBounds, windowBounds } = payload;
  if (!trayBounds || !windowBounds) {
    return;
  }

  const rect = menu.getBoundingClientRect();
  const menuWidth = rect.width;
  const menuHeight = rect.height;

  const trayCenterX = trayBounds.x + trayBounds.width / 2 - windowBounds.x;
  const trayTop = trayBounds.y - windowBounds.y;
  const trayBottom = trayBounds.y + trayBounds.height - windowBounds.y;

  let top = trayTop - menuHeight - 8;
  if (top < PADDING) {
    top = trayBottom + 8;
  }

  let left = trayCenterX - menuWidth / 2;
  const maxLeft = windowBounds.width - menuWidth - PADDING;
  left = Math.min(Math.max(left, PADDING), Math.max(PADDING, maxLeft));

  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}

function updateMenuState(payload) {
  if (!toggleButton || !payload) {
    return;
  }
  toggleButton.textContent = payload.isRecording ? 'Arrêter la dictée' : 'Démarrer la dictée';
}

function closeMenu() {
  if (window.electronAPI?.closeTrayMenu) {
    window.electronAPI.closeTrayMenu();
  }
}

if (menu) {
  menu.addEventListener('click', (event) => {
    const actionTarget = event.target.closest('[data-action]');
    if (!actionTarget) {
      return;
    }
    const action = actionTarget.dataset.action;
    if (action && window.electronAPI?.sendTrayMenuAction) {
      window.electronAPI.sendTrayMenuAction(action);
    }
  });
}

document.addEventListener('pointerdown', (event) => {
  if (!menu) {
    return;
  }
  if (!menu.contains(event.target)) {
    closeMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

if (window.electronAPI?.onTrayMenuOpen) {
  window.electronAPI.onTrayMenuOpen((payload) => {
    requestAnimationFrame(() => positionMenu(payload));
  });
}

if (window.electronAPI?.onTrayMenuData) {
  window.electronAPI.onTrayMenuData((payload) => {
    updateMenuState(payload);
  });
}
