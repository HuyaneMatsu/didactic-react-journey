export type Setter<Type> = (value: Type) => void;
export type Hook<Type> = [Type, Setter<Type>];

export type NumberSetter = Setter<number>;
export type NumberHook = Hook<number>;

export type StringSetter = Setter<string>;
export type StringHook = Hook<string>;

export type Navigator = Setter<string>;
