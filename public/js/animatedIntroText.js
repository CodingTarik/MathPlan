/**
 * Array of strings for animated text.
 * @type {string[]}
 */
const introTexts = [
  'Validieren.',
  'Planen.',
  'Genehmigen.',
  'Schnell.',
  'Einfach.',
  'Sicher.',
  'Digital.',
  'Effizient.',
  'Für Mathematiker.',
  'Besser als Inferno 😂',
  'Erstellt mit ❤️',
  'Mathebau.',
  'Einfach Materno🌍'
];

/**
 * Typed instance to handle animated text.
 * @type {Typed}
 */
const typed = new Typed('#animatedText', {
  /**
   * Array of strings to be typed.
   * @type {string[]}
   */
  strings: introTexts,

  /**
   * Enable looping of the typed strings.
   * @type {boolean}
   */
  loop: true,

  /**
   * Typing speed in milliseconds.
   * @type {number}
   */
  typeSpeed: 50
});
