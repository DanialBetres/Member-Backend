exports.dateToString = (date) => {
    if (date) {
        return new Date(date).toISOString();
    }

    return null;
}

exports.dateStringToDate = (dateString) => {
    if (dateString) {
        return new Date(dateString)
    }

    return null;
}