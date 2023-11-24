CREATE DATABASE data_app;
USE data_app;

CREATE TABLE module (
    modulnummer integer PRIMARY KEY,
    modulname VARCHAR(255),
    cp integer,
    sprache VARCHAR(255),
    verwendbarkeit VARCHAR(255) 
);

INSERT INTO module (modulnummer, modulname, cp, sprache, verwendbarkeit)
VALUES
(1, 'Analysis', 9, 'Deutsch', 'B. Sc. Mathematik');
INSERT INTO module (modulnummer, modulname, cp, sprache, verwendbarkeit)
VALUES
(2, 'Numerik', 3, 'Englisch', 'B. Sc. Mathematik');