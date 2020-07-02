const delhivery = require('./delhivery');
const dtdc = require('./dtdc');

const exportService = (serviceName) => {
    try {
        switch (serviceName) {
            case "DELHIVERY":
                return new delhivery();
            case "DTDC":
                return new dtdc();
            default:
                throw new Error("INVALID DELIVERY SERVICE")
        }

    } catch (error) {
        throw error;

    }

}

module.exports = exportService;