const delhivery = require('./delhivery');

const exportService = (serviceName) => {
    try {
        switch(serviceName){
            case "DELHIVERY":
                return new delhivery();
                break;
            default:
                throw new Error("INVALID DELIVERY SERVICE")
        }

    } catch (error) {
        throw error;

    }

}

module.exports = exportService;