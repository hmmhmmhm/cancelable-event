class Priority {
    static get async() {
        return -1
    }

    static get under() {
        return 0
    }

    static get lowest() {
        return 1
    }

    static get low() {
        return 2
    }

    static get normal() {
        return 3
    }

    static get high() {
        return 4
    }

    static get highest() {
        return 5
    }

    static get monitor() {
        return 6
    }
}

module.exports = Priority