const fs = require('fs');

class Cfdi {
    dbPath = './js/db.json';

    constructor() {
        this.readDB();
    }

    saveDB(input) {
        const payload = {
            lastFac: Number(input)
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    readDB() {
        if (!fs.existsSync(this.dbPath)) return
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' })
        if (!info) return
        const { lastFac } = JSON.parse(info);
        this.lastFac = lastFac
    }
}


module.exports = Cfdi;