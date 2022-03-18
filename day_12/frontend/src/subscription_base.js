import {remove_from_list} from './utils';

export class SubscriptionBase {
    constructor() {
        this.subscribers = [];
    }

    display(route) {
        if (route === undefined) {
            route = null;
        }

        var subscriber;
        for (subscriber of this.subscribers) {
            subscriber.trigger(route);
        }
    }

    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }

    unsubscribe(subscriber) {
        remove_from_list(this.subscribers, subscriber);
    }
}
