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

        var to_log;
        if (route === null) {
            to_log = `Triggering subscription update in ${subscribers.length} subscribers`;
        } else {
            to_log = `Triggering subscription update in ${subscribers.length} subscribers| Redirecting to ${route}`;
        }
        console.log(to_log);

        var subscriber;
        for (subscriber of subscribers) {
            subscriber.trigger(route);
        }
    }

    subscribe(subscriber) {
        var subscribers = this.subscribers;
        subscribers.push(subscriber);

        console.log(`Subscribing for updates | Total ${subscribers.length} subscribers`);
    }

    unsubscribe(subscriber) {
        var subscribers = this.subscribers;
        remove_from_list(subscribers, subscriber);

        console.log(`Unsubscribing from updates | Total ${subscribers.length} subscribers left`)
    }
}
