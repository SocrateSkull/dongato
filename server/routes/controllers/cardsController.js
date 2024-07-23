const { get_bins_by_country_card_type_and_bank, get_bin_info } = require('../api_loader');
const { generate_card_number, luhn_algorithm, generate_cvv } = require('../card_generator');
const { datetime } = require('datetime');

const generateCards = (req, res) => {
    const { bin_number } = req.body;
    if (!bin_number) {
        return res.status(400).json({ error: "BIN number is required" });
    }
    
    const selected_bin = bin_number;
    const cards = [];
    const current_year = datetime.now().year;
    while (cards.length < 20) {
        const card_number = generate_card_number(selected_bin);
        if (luhn_algorithm(card_number)) {
            const expiry_month = Math.floor(Math.random() * 12) + 1;
            const expiry_year = current_year + Math.floor(Math.random() * 5) + 1;
            const cvv = generate_cvv();
            cards.push(`${card_number}|${expiry_month.toString().padStart(2, '0')}|${expiry_year}|${cvv}`);
        }
    }

    res.json(cards);
};

const verifyCard = (req, res) => {
    const { card_details } = req.body;
    const [card_number, exp_month, exp_year, cvv] = card_details.split('|');
    if (!luhn_algorithm(card_number)) {
        return res.status(400).json({ error: "Invalid card number" });
    }

    const bin_number = card_number.slice(0, 6);
    const bin_info = get_bin_info(bin_number);
    if (bin_info) {
        const bank = bin_info.bank?.name || 'Unknown';
        const country = bin_info.country?.name || 'Unknown';
        const card_type = bin_info.type || 'Unknown';
        res.json({
            card_number,
            bank,
            country,
            card_type,
            valid: true
        });
    } else {
        res.status(404).json({ error: "BIN information not found" });
    }
};

const generateCustomCards = (req, res) => {
    const { custom_input } = req.body;
    try {
        const [bin_part, exp_month, exp_year] = custom_input.split('|');
        if (bin_part.length < 6 || exp_month.length != 2 || exp_year.length != 4) {
            throw new Error("Incorrect format");
        }

        const cards = [];
        while (cards.length < 20) {
            const card_number = bin_part.replace(/x/g, () => Math.floor(Math.random() * 10).toString());
            if (luhn_algorithm(card_number)) {
                const cvv = generate_cvv();
                cards.push(`${card_number}|${exp_month}|${exp_year}|${cvv}`);
            }
        }

        res.json(cards);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { generateCards, verifyCard, generateCustomCards };
