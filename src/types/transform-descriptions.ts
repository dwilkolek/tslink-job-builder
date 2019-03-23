export interface TransformDescription {
    transform: (data: Buffer, encoding: string) => Buffer | undefined;
}