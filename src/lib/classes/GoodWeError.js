
class GoodWeError extends Error {
    constructor(err) {
        super(err.message);
        this.error = err;
        this.name = 'GoodWeError';
        console.error(err.message); // eslint-disable-line
    }
}

export default GoodWeError;
