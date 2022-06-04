const dbQuery = require("./database");

async function defaultTables () {
    //create table to store user's choices.
    // The "traits" fields will be populated with JSON of options available for the specific device type
    await dbQuery(`
        CREATE TABLE IF NOT EXISTS userDevices (
            id MEDIUMINT NOT NULL AUTO_INCREMENT,
            name CHAR(30) NOT NULL,
            deviceType CHAR(30) NOT NULL,
            traits JSON,
            PRIMARY KEY (id),
            UNIQUE KEY (name)
        ); 
    `)
    //create table to store default types for the user to choose from the list
    //to avoid duplication each time, use UNIQUE KEY of name
    await dbQuery(`
        CREATE TABLE IF NOT EXISTS deviceTypes(
            id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
            name CHAR(30) NOT NULL,
            traits JSON NOT NULL,
            UNIQUE KEY (name) 
        );
    `)
    //insert types of devices with their default traits
    await dbQuery(`INSERT IGNORE INTO deviceTypes (name, traits) VALUES
          (
            'Curtains and blinds',
            '[{"trait_name": "fully open/close", "trait_type": "boolean"}, {"trait_name": "opened extent", "trait_type": "integer"}]'
          ),
          ( 
            'Cooling and heating systems',
            '[{"trait_name": "on", "trait_type": "boolean"}, {"trait_name": "temperature", "trait_type": "integer"}, {"trait_name": "fun speed", "trait_type": "integer"}]'
          ),
          (
            'TV, radio and audio systems',
            '[{"trait_name": "on", "trait_type": "boolean"}, {"trait_name": "volume", "trait_type": "integer"}, {"trait_name": "channel", "trait_type": "integer"}]'
          ),
          (
            'Lightning',
            '[{"trait_name": "on", "trait_type": "boolean"}, {"trait_name": "brightness", "trait_type": "integer"}]'
          ),
          (
            'Fridge-freezers, ovens, toasters',
            '[{"trait_name": "on", "trait_type": "boolean"}, {"trait_name": "open/close", "trait_type": "boolean"}, {"trait_name": "temperature", "trait_type": "integer"}]'
          ),
          (
            'Kitchen appliances',
            '[{"trait_name": "on", "trait_type": "boolean"}]'
          ),
          (
            'Security systems',
            '[{"trait_name": "on", "trait_type": "boolean"}, {"trait_name": "volume", "trait_type": "integer"}]'
          ),
          (
            'CCTV',
            '[{"trait_name": "on", "trait_type": "boolean"}, {"trait_name": "degree-angle", "trait_type": "integer"}, {"trait_name": "zoom", "trait_type": "integer"}]'
          ),
          (
            'Air-purifiers, air-fresheners, dehydrators',
            '[{"trait_name": "on", "trait_type": "boolean"}, {"trait_name": "speed", "trait_type": "integer"}]'
          ),
          (
            'Doors, gates and windows',
            '[{"trait_name": "open/close", "trait_type": "boolean"}]'
          );
    `);
}

module.exports = defaultTables;