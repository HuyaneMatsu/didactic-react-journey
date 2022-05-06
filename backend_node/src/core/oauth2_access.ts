import {OA2AccessData} from './../structures';


export class OA2Access {
    access_token: string;
    created_at_seconds: number;
    expires_after: number;
    redirect_url: string;
    refresh_token: string;
    scopes: string;

    constructor(data: OA2AccessData, redirect_url: string) {
        this.redirect_url = redirect_url;
        this.access_token = data['access_token'];

        var refresh_token: string | undefined = data['refresh_token'];
        if (refresh_token === undefined) {
            refresh_token = '';
        }
        this.refresh_token = refresh_token;

        this.expires_after = data['expires_in'];
        this.scopes = data['scope'];

        this.created_at_seconds = Date.now() * 1000;
    }

    get_created_at() {
        return new Date(this.created_at_seconds);
    }

    get_expires_at() {
        return new Date(this.created_at_seconds + this.expires_after);
    }
}
