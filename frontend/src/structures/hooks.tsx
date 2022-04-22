export type NumberSetter = (value: number) => void;
export type NumberHook = [number, NumberSetter];

export type StringSetter = (value: string) => void;
export type StringHook = [string, StringSetter];

export type Navigator = (value: string) => void;
