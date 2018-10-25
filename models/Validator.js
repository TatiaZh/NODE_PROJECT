function validateCar(car) {
    const { VIN, number } = car;
    const color = car.color || 'Not Provided';
    const brand = car.brand || 'Not Provided';
    const model = car.model || 'Not Provided';
    const year = car.year || 'Not Provided';
    const owner = car.owner || 'Not Provided';

    if ((!/[a-zA-Z]+/.test(brand) && brand !== 'Not Provided')
        || (!/[a-zA-Z]+/.test(color) && color !== 'Not Provided')
        || (!/[a-zA-Z]+/.test(owner) && owner !== 'Not Provided')) {
        return { error: 'Brand/Color/Owner must be in string format' }
    }
    if (!VIN || VIN.length !== 17) {
        return { error: 'VIN must 17 characters long' }
    }
    if (!number || !/[a-zA-Z]{2}-\d{3}-[a-zA-Z]{2}/.test(number)) {
        return { error: 'Number must be in XX-000-XX format' }
    }
    if (!/19\d{2}|20\d{2}/.test(year) && year !== 'Not Provided') {
        return { error: 'Year is not valid' }
    }
    return { VIN, number, brand, model, color, year, owner };
}

function validateUser(user) {
    const { fName, lName, id } = user;
    const father = user.father || 'Not Provided';
    const bDay = user.bDay || 'Not Provided';
    if (!/[a-zA-Z]+/.test(fName) || !/[a-zA-Z]+/.test(lName) || !/[a-zA-Z]+/.test(father)) {
        return { error: 'First Name/Last Name/Father\'s Name must be in string format' }
    }
    if (!/^\d{11}$/.test(id)) {
        return { error: 'Id must be all digits and 11 characters long' }
    }
    if (!/\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])*/.test(bDay) && bDay !== 'Not Provided') {
        return { error: 'Birthday must be in YYYY-MM-DD format' }
    }
    return { fName, lName, id, father, bDay };
}

module.exports = {
    validateUser,
    validateCar
}