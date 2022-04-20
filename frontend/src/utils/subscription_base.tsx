import {remove_from_list} from './helpers';
import {Subscription} from './subscription_hooks';

export class SubscriptionAPIBase {
    subscribers: array<Subscription>;

    constructor() {
        this.subscribers = [];
    }

    display(route: undefined | null | string) {
        if (route === undefined) {
            route = null;
        }

        var subscribers = this.subscribers;

        var subscriber: Subscription;
        for (subscriber of subscribers) {
            subscriber.trigger(route);
        }
    }

    subscribe(subscriber: Subscription) {
        var subscribers = this.subscribers;
        subscribers.push(subscriber);
    }

    unsubscribe(subscriber: Subscription) {
        var subscribers = this.subscribers;
        remove_from_list(subscribers, subscriber);
    }
}
