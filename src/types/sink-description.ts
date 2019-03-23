export interface SinkDescription {
    write: (data: Buffer, encoding: string, done: () => void) => void;
}