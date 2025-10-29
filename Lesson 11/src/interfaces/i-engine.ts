export interface IEngine {
    start(): void;
    stop(): void;
    getEfficiency(): number;
    toString(): string;
}
