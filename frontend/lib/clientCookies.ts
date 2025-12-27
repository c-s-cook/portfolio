
export class clientCookies {
    static set(cname: string, cvalue: string, exdays?: number): void {
        if (typeof document === 'undefined') return; // guard for SSR
        const d = new Date();
        let expires = "";
        if (exdays) {
            d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
            expires = "expires=" + d.toUTCString();
        }

        // encode value for safety
        document.cookie = `${cname}=${encodeURIComponent(cvalue)};${expires};path=/`;
    }

    static get(cname: string): string {
        if (typeof document === 'undefined') return "";
        const name = cname + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) {
                return decodeURIComponent(c.substring(name.length));
            }
        }
        return "";
    }

    static delete(cname: string): void {
        if (typeof document === 'undefined') return;
        document.cookie = `${cname}=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}