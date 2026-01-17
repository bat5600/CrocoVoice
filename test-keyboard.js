/**
 * Script de test pour vérifier si la frappe clavier fonctionne
 * Exécutez avec: node test-keyboard.js
 */

const { keyboard } = require('@nut-tree-fork/nut-js');

async function testKeyboard() {
  console.log('🧪 Test de la frappe clavier...');
  console.log('⏳ Vous avez 5 secondes pour cliquer dans une zone de texte (Notepad, VS Code, etc.)...');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log('⌨️ Début du test de frappe...');
  
  try {
    keyboard.config.autoDelayMs = 50;
    await keyboard.type('Test de frappe automatique - Si vous voyez ce texte, ça fonctionne !');
    console.log('✅ Test réussi !');
  } catch (error) {
    console.error('❌ Erreur:', error);
    console.error('Stack:', error.stack);
  }
}

testKeyboard();
