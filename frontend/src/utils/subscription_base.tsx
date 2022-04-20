import {remove_from_list} from './helpers';
import {Subscription} from './subscription_hook';

export class SubscriptionAPIBase {
    subscribers: Array<Subscription>;

    constructor() {
        this.subscribers = [];
    }

    display(route: null | string): void {
        if (route === undefined) {
            route = null;
        }

        var subscribers = this.subscribers;

        var subscriber: Subscription;
        for (subscriber of subscribers) {
            subscriber.trigger(route);
        }
    }

    subscribe(subscriber: Subscription): void {
        var subscribers = this.subscribers;
        subscribers.push(subscriber);
    }

    unsubscribe(subscriber: Subscription): void {
        var subscribers = this.subscribers;
        remove_from_list(subscribers, subscriber);
    }
}
