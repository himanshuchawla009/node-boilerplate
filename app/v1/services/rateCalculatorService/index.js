const fs = require('fs');
const Papa = require('papaparse');
const estimateDeliveryCharge = async (pincode, weight) => {
    try {
        weight = parseInt(weight)
        let { group, estimatedDeliveryTime } = await findPincodeGroup(pincode);
        if (group === "1") {
            console.log("wigjt", weight)

            let charge = await estimateLocalGroupCharge(weight);
            return { charge, estimatedDeliveryTime };

        } else if (group === "2") {

            let charge = await estimateNorthGroupCharge(weight);
            return { charge, estimatedDeliveryTime };

        } else if (group === "3") {

            let charge = await estimateMetroGroupCharge(weight);
            return { charge, estimatedDeliveryTime };

        } else if (group === "4") {

            let charge = await estimateRoiGroupCharge(weight);
            return { charge, estimatedDeliveryTime };

        } else {
            throw new Error("Pincode is not servicable");
        }


    } catch (error) {
        throw error;
    }
}


const findPincodeGroup = async (pincode) => {
    try {
        if(pincode >= 110001 && pincode <= 173213) {
            const csv = await fs.readFileSync('data/chunks/pincode1.csv');
            const csvData = Papa.parse(csv.toString(), {header:true}).data
            let rec = csvData.filter(data => data.Pincode === pincode.toString())[0];
            let group = rec['Rate group'];
            let time = rec['Transit Time']
            console.log("group", group)
            return {
                group, estimatedDeliveryTime:time
            }

           
            
        } else if(pincode >= 173214 && pincode <= 230403) {
            const csv = await fs.readFileSync('data/chunks/pincode2.csv');
            const csvData = Papa.parse(csv.toString(), {header:true}).data
            let rec = csvData.filter(data => data.Pincode === pincode.toString())[0];
            let group = rec['Rate group'];
            let time = rec['Transit Time']
            console.log("group", group)
            return {
                group, estimatedDeliveryTime:time
            }
        } else if(pincode >= 230404 && pincode <= 285130) {
            const csv = await fs.readFileSync('data/chunks/pincode3.csv');
            const csvData = Papa.parse(csv.toString(), {header:true}).data
            let rec = csvData.filter(data => data.Pincode === pincode.toString())[0];
            let group = rec['Rate group'];
            let time = rec['Transit Time']
            console.log("group", group)
            return {
                group, estimatedDeliveryTime:time
            }
        } else if(pincode >= 285187 && pincode <= 364006) {
            const csv = await fs.readFileSync('data/chunks/pincode4.csv');
            const csvData = Papa.parse(csv.toString(), {header:true}).data
            let rec = csvData.filter(data => data.Pincode === pincode.toString())[0];
            let group = rec['Rate group'];
            let time = rec['Transit Time']
            console.log("group", group)
            return {
                group, estimatedDeliveryTime:time
            } 
        } else if(pincode >= 364060 && pincode <= 410218) {
            const csv = await fs.readFileSync('data/chunks/pincode5.csv');
            const csvData = Papa.parse(csv.toString(), {header:true}).data
            let rec = csvData.filter(data => data.Pincode === pincode.toString())[0];
            let group = rec['Rate group'];
            let time = rec['Transit Time']
            console.log("group", group)
            return {
                group, estimatedDeliveryTime:time
            }
        } else if(pincode >= 410219 && pincode <= 425323) {
            const csv = await fs.readFileSync('data/chunks/pincode6.csv');
            const csvData = Papa.parse(csv.toString(), {header:true}).data
            let rec = csvData.filter(data => data.Pincode === pincode.toString())[0];
            let group = rec['Rate group'];
            let time = rec['Transit Time']
            console.log("group", group)
            return {
                group, estimatedDeliveryTime:time
            }
        } else if(pincode >= 425324 && pincode <= 502290) {
            const csv = await fs.readFileSync('data/chunks/pincode7.csv');
            const csvData = Papa.parse(csv.toString(), {header:true}).data
            let rec = csvData.filter(data => data.Pincode === pincode.toString())[0];
            let group = rec['Rate group'];
            let time = rec['Transit Time']
            console.log("group", group)
            return {
                group, estimatedDeliveryTime:time
            }
        } else if(pincode >= 502291 && pincode <= 518599) {
            const csv = await fs.readFileSync('data/chunks/pincode8.csv');
            const csvData = Papa.parse(csv.toString(), {header:true}).data
            let rec = csvData.filter(data => data.Pincode === pincode.toString())[0];
            let group = rec['Rate group'];
            let time = rec['Transit Time']
            console.log("group", group)
            return {
                group, estimatedDeliveryTime:time
            }
        } else if(pincode >= 518601 && pincode <= 534442) {
            const csv = await fs.readFileSync('data/chunks/pincode9.csv');
            const csvData = Papa.parse(csv.toString(), {header:true}).data
            let rec = csvData.filter(data => data.Pincode === pincode.toString())[0];
            let group = rec['Rate group'];
            let time = rec['Transit Time']
            console.log("group", group)
            return {
                group, estimatedDeliveryTime:time
            }
        } else if(pincode >= 534447 && pincode <= 581374) {
            const csv = await fs.readFileSync('data/chunks/pincode10.csv');
            const csvData = Papa.parse(csv.toString(), {header:true}).data
            let rec = csvData.filter(data => data.Pincode === pincode.toString())[0];
            let group = rec['Rate group'];
            let time = rec['Transit Time']
            console.log("group", group)
            return {
                group, estimatedDeliveryTime:time
            }
        } else if(pincode >= 581384 && pincode <= 610003) {
            const csv = await fs.readFileSync('data/chunks/pincode11.csv');
            const csvData = Papa.parse(csv.toString(), {header:true}).data
            let rec = csvData.filter(data => data.Pincode === pincode.toString())[0];
            let group = rec['Rate group'];
            let time = rec['Transit Time']
            console.log("group", group)
            return {
                group, estimatedDeliveryTime:time
            }
        } else if(pincode >= 610051 && pincode <= 629178) {
            const csv = await fs.readFileSync('data/chunks/pincode12.csv');
            const csvData = Papa.parse(csv.toString(), {header:true}).data
            let rec = csvData.filter(data => data.Pincode === pincode.toString())[0];
            let group = rec['Rate group'];
            let time = rec['Transit Time']
            console.log("group", group)
            return {
                group, estimatedDeliveryTime:time
            }
        } else if(pincode >= 629179 && pincode <= 673016) {
            const csv = await fs.readFileSync('data/chunks/pincode13.csv');
            const csvData = Papa.parse(csv.toString(), {header:true}).data
            let rec = csvData.filter(data => data.Pincode === pincode.toString())[0];
            let group = rec['Rate group'];
            let time = rec['Transit Time']
            console.log("group", group)
            return {
                group, estimatedDeliveryTime:time
            }
        } else if(pincode >= 673017 && pincode <= 689542) {
            const csv = await fs.readFileSync('data/chunks/pincode14.csv');
            const csvData = Papa.parse(csv.toString(), {header:true}).data
            let rec = csvData.filter(data => data.Pincode === pincode.toString())[0];
            let group = rec['Rate group'];
            let time = rec['Transit Time']
            console.log("group", group)
            return {
                group, estimatedDeliveryTime:time
            }
        } else if(pincode >= 689543 && pincode <= 722102) {
            const csv = await fs.readFileSync('data/chunks/pincode15.csv');
            const csvData = Papa.parse(csv.toString(), {header:true}).data
            let rec = csvData.filter(data => data.Pincode === pincode.toString())[0];
            let group = rec['Rate group'];
            let time = rec['Transit Time']
            console.log("group", group)
            return {
                group, estimatedDeliveryTime:time
            }
        } else if(pincode >= 722103 && pincode <= 759104) {
            const csv = await fs.readFileSync('data/chunks/pincode16.csv');
            const csvData = Papa.parse(csv.toString(), {header:true}).data
            let rec = csvData.filter(data => data.Pincode === pincode.toString())[0];
            let group = rec['Rate group'];
            let time = rec['Transit Time']
            console.log("group", group)
            return {
                group, estimatedDeliveryTime:time
            }
        } else if(pincode >= 759105 && pincode <= 855108) {
            const csv = await fs.readFileSync('data/chunks/pincode17.csv');
            const csvData = Papa.parse(csv.toString(), {header:true}).data
            let rec = csvData.filter(data => data.Pincode === pincode.toString())[0];
            let group = rec['Rate group'];
            let time = rec['Transit Time']
            console.log("group", group)
            return {
                group, estimatedDeliveryTime:time
            }
        } else  {
            console.log("error", pincode)
            return { group :-1,estimatedDeliveryTime: -1 }
        }

    } catch (error) {
        throw error;
    }
}


const estimateLocalGroupCharge = async (weight) => {
    try {
        let charge = 0;
        weight = weight /1000

        if (weight <= 1) {
            charge = charge + 42;


        } else if (weight <= 5) {
            charge = charge + 42;
            charge = charge + (weight - 1) * 22.50;

        } else if (weight <= 10) {
            charge = charge + 42;
            charge = charge + (weight - 1) * 15;
        } else if (weight <= 25) {
            charge = charge + 42;
            charge = charge + (4 * 22.50);
            weight = weight - 5;
            charge = charge + (weight) * 15;


        } else if (weight <= 50) {
            charge = charge + 42;
            charge = charge + (4 * 22.50);
            weight = weight - 5;
            charge = charge + (weight) * 15;

        } else if (weight <= 100) {
            charge = charge + 42;
            charge = charge + (4 * 22.50);
            weight = weight - 5;
            charge = charge + (weight) * 15;
        } else if (weight >= 100) {
            charge = charge + 42;
            charge = charge + (4 * 22.50);
            weight = weight - 5;
            charge = charge + (weight) * 15;

        }
        console.log("weight", charge, weight)

        return charge;

    } catch (error) {
        throw error;
    }
}


const estimateNorthGroupCharge = async (weight) => {
    try {

        let charge;
        weight = weight /1000

        if (weight <= 1) {
            charge = charge + 42;


        } else if (weight <= 5) {
            charge = charge + 42;
            charge = charge + (weight - 1) * 36;

        } else if (weight <= 10) {
            charge = charge + 42;
            charge = charge + (weight - 1) * 31.50;
        } else if (weight <= 25) {
            charge = charge + 42;
            charge = charge + (4 * 36);
            weight = weight - 5;
            charge = charge + (weight) * 31.50;

        } else if (weight <= 50) {
            charge = charge + 42;
            charge = charge + (4 * 36);
            weight = weight - 5;
            charge = charge + (weight) * 31.50;

        } else if (weight <= 100) {
            charge = charge + 42;
            charge = charge + (4 * 36);
            weight = weight - 5;
            charge = charge + (weight) * 31.50;
        } else if (weight >= 100) {
            charge = charge + 42;
            charge = charge + (4 * 36);
            weight = weight - 5;
            charge = charge + (weight) * 31.50;

        }

        return charge;
    } catch (error) {
        throw error;
    }
}

const estimateMetroGroupCharge = async (weight) => {
    try {
        let charge;
        weight = weight /1000

        if (weight <= 1) {
            charge = charge + 60;

        } else if (weight <= 5) {
            charge = charge + 60;
            charge = charge + (weight - 1) * 49.50;

        } else if (weight <= 10) {
            charge = charge + 60;
            charge = charge + (weight - 1) * 45;
        } else if (weight <= 25) {
            charge = charge + 60;
            charge = charge + (4 * 49.50);
            weight = weight - 5;
            charge = charge + (weight) * 45;

        } else if (weight <= 50) {
            charge = charge + 60;
            charge = charge + (4 * 49.50);
            weight = weight - 5;
            charge = charge + (weight) * 45;
        } else if (weight <= 100) {
            charge = charge + 60;
            charge = charge + (4 * 49.50);
            weight = weight - 5;
            charge = charge + (weight) * 45;
        } else if (weight >= 100) {
            charge = charge + 60;
            charge = charge + (4 * 49.50);
            weight = weight - 5;
            charge = charge + (weight) * 45;
        }

        return charge;

    } catch (error) {
        throw error;
    }
}

const estimateRoiGroupCharge = async (weight) => {
    try {
        let charge;
        weight = weight /1000
        if (weight <= 1) {
            
            charge = charge + 75;

        } else if (weight <= 5) {
            charge = charge + 42;
            charge = charge + (weight - 1) * 63;

        } else if (weight <= 10) {
            charge = charge + 42;
            charge = charge + (weight - 1) * 58.50;
        } else if (weight <= 25) {
            charge = charge + 42;
            charge = charge + (weight - 1) * 54;

        } else if (weight <= 50) {
            charge = charge + 42;
            charge = charge + (weight - 1) * 46.50;

        } else if (weight <= 100) {
            charge = charge + 42;
            charge = charge + (weight - 1) * 43.50;

        } else if (weight >= 100) {
            charge = charge + 42;
            charge = charge + (weight - 1) * 40.50;

        }

        return charge;

    } catch (error) {
        throw error;
    }
}



module.exports = { estimateDeliveryCharge }