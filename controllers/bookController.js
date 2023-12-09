// Just an example, will be deleted later
const { check, validationResult } = require('express-validator');
exports.handleGetBook = [
  check('title')
    .isLength({ min: 5 })
    .withMessage('Der Titel muss mindestens 5 Zeichen lang sein'),
  check('title')
    .isAlphanumeric()
    .withMessage('Der Titel darf nur aus Buchstaben bestehen'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const title = req.params.title;
    res.json({ message: `Der Titel "${title}" erfüllt die Anforderungen.` });
  }
];