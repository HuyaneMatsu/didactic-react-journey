export class ExceptionMessageHolder {
    exception_message: null | string;
    
    constructor() {
        this.exception_message = null;
    }

    get() {
        return this.exception_message;
    }

    set(exception_message: string) {
       this.exception_message = exception_message;
    }

    clear() {
        this.exception_message = null;
    }
}
