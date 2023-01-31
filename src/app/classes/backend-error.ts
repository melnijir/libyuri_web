export class BackendError {
    isError: boolean;
    description: string;

    constructor(isError: boolean, description: string) {
        this.isError = isError;
        this.description = description;
    }
}
