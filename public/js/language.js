// Register eventer listeners for clicking on the language de
document.getElementById('languageDe').addEventListener('click', function () {
  setLanguage('de');
});
// Register eventer listeners for clicking on the language en
document.getElementById('languageEn').addEventListener('click', function () {
  setLanguage('en');
});

/**
 * Sets the language in the document cookie and updates the language dropdown UI.
 * @param {string} language - The language code ('de' for German, 'en' for English, etc.).
 * @returns {void}
 */
function setLanguage(language) {
  // Set the language in the document cookie
  document.cookie = 'language=' + language;

  // Update the language dropdown UI
  document.getElementById('languageDropdown').innerHTML =
    '<i class="fa fa-flag"></i> ' + (language === 'de' ? '🇩🇪' : '🇬🇧');
}
