export class ExceptionMessageHolder {
    constructor() {
        this.exception_message = null;
    }

    get() {
        return this.exception_message;
    }

    set(exception_message) {
       this.exception_message = exception_message;
    }

    clear() {
        this.exception_message = null;
    }
}
