function closeWidgetMenu() {
  if (window.electronAPI?.closeWidgetContextMenu) {
    window.electronAPI.closeWidgetContextMenu();
  }
}

document.addEventListener('pointerdown', (event) => {
  if (event.button !== 0 && event.button !== 2) {
    return;
  }
  closeWidgetMenu();
});

document.addEventListener('mousedown', (event) => {
  if (event.button !== 0 && event.button !== 2) {
    return;
  }
  closeWidgetMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeWidgetMenu();
  }
});
