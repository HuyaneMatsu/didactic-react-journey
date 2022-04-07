import {remove_from_list} from './helpers';

export class SubscriptionAPIBase {
    constructor() {
        this.subscribers = [];
    }

    display(route) {
        if (route === undefined) {
            route = null;
        }

        var subscribers = this.subscribers;

        var subscriber;
        for (subscriber of subscribers) {
            subscriber.trigger(route);
        }
    }

    subscribe(subscriber) {
        var subscribers = this.subscribers;
        subscribers.push(subscriber);
    }

    unsubscribe(subscriber) {
        var subscribers = this.subscribers;
        remove_from_list(subscribers, subscriber);
    }
}
