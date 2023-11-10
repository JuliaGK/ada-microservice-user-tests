CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50),
    shift VARCHAR(50),
    year VARCHAR(50),
    room VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS professionals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50),
    birthday VARCHAR(50),
    adress VARCHAR(50),
    role VARCHAR(50),
    shift VARCHAR(50),
    sector VARCHAR(50)
);