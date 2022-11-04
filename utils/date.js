exports.dateToString = (date) => {
    if (date) {
        return new Date(date).toISOString();
    }

    return null;
}