
class Store {
    private state = {}

    public getState() {
        return this.state;
    }

    public set(path: string, value: unknown) {
        // set(this.state, path, value);
    }
}