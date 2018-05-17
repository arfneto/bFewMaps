
-- this is from logging of the location data

SHOW DATABASES;

DROP DATABASE cars;

CREATE DATABASE cars;

USE cars;

CREATE TABLE veiculos
(
    id INT 
      AUTO_INCREMENT
      PRIMARY KEY,
    ackDate 
      TIMESTAMP DEFAULT NOW(),
    
    code TEXT(6) NOT NULL,
    plate INT NOT NULL,
    timeOfReading DATETIME NOT NULL,
    ignition TEXT(4) NOT NULL,
    kmInfo TEXT(10) NOT NULL,
    speed TEXT(4) NOT NULL,
    s1 TEXT(4) NOT NULL,
    s2 TEXT(4) NOT NULL,
    tension TEXT(6) NOT NULL,
    LAT TEXT(10) NOT NULL,
    LNG TEXT(10) NOT NULL,
    address VARCHAR(255) NOT NULL,
    vehicleType TEXT(10) NOT NULL,
    course TEXT(10) NOT NULL,
    rpm TEXT(6) NOT NULL,
    deviceID TEXT(6) NOT NULL
);

CREATE TABLE carMap
(
    plate INT PRIMARY KEY,
    lastLAT TEXT(10) NOT NULL,
    lastLNG TEXT(10) NOT NULL,
    lastReading DATETIME NOT NULL,
    moreInfo TEXT(1000)
);

CREATE TABLE brID
(
    licenseInfo VARCHAR(8) PRIMARY KEY,
    plate INT NOT NULL,
    
    FOREIGN KEY (plate) REFERENCES carMap(plate)
);


DESC veiculos;

DESC carMap;

DESC brID;

SHOW TABLES;


