import {ButtonKeyEvent, InputChangeEvent, FormSubmitEvent} from './events';

export type Callback = () => void;
export type ButtonKeyEventCallback = (event: ButtonKeyEvent) => void;
export type InputChangeEventCallback = (event: InputChangeEvent) => void;
export type FormSubmitEventCallback = (event: FormSubmitEvent) => void;
