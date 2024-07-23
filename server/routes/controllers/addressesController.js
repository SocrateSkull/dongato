const path = require('path');
const fs = require('fs');
const { random, normalize_string } = require('../utils');

const addressesFilePath = path.join(__dirname, '../addresses.json');
const addressesData = JSON.parse(fs.readFileSync(addressesFilePath, 'utf-8'));

const generateRandomAddress = (req, res) => {
    const { country, state, gender } = req.body;
    
    if (!country || !state) {
        return res.status(400).json({ error: "Country and state are required" });
    }

    const normalized_country = normalize_string(country);
    const normalized_state = normalize_string(state);
    const filtered_addresses = addressesData.filter(addr => 
        normalize_string(addr.country) === normalized_country && normalize_string(addr.state) === normalized_state);

    if (filtered_addresses.length === 0) {
        return res.status(404).json({ error: "No addresses found for the selected location" });
    }

    const address = random.choice(filtered_addresses);
    const name = (gender === "Masculino")
        ? random.choice(["Joseph Roosselvet Smith", "Frank Joe Black"])
        : random.choice(["Jennifer Dorie Cooper", "Ann Christine Gordon"]);

    res.json({
        name,
        street: address.street,
        city: address.city,
        state: address.state,
        zip_code: address.zip_code || 'Unknown',
        country: address.country,
        phone_number: address.phone_number
    });
};

module.exports = { generateRandomAddress };
