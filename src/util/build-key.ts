import axios from "axios";
import jsdom, { JSDOM } from "jsdom";
import { localStorage } from "./localStorage";

async function getRawZybooks(): Promise<string> {
    const cachedRaw = localStorage.getItem("zybooks-html");
    if (cachedRaw) return cachedRaw;
    const { data } = await axios.get<string>("https://learn.zybooks.com/signin");
    localStorage.setItem("zybooks-html", data);
    return data;
}

async function getZyDOM(): Promise<JSDOM> {
    return new JSDOM(await getRawZybooks());
}

interface ZyRuntimeConfiguration {
    environment: string;
    locationType: string;
    modulePrefix: string;
    rootURL: string;
    EmberENV: {
        FEATURES: {};
        EXTEND_PROTOTYPES: boolean;
    };
    APP: {
        ACCESS_DEV: boolean;
        ADMIN_URL: string;
        ANALYTICS_URL: string;
        API_HOST: string;
        AUTHORS_ONLY: boolean;
        BUILDKEY: string;
        CLOUDSEARCH_ENDPOINT: string;
        DISABLE_EVENTS: boolean;
        ENABLE_ZYANALYTICS_WEB: "true" | "false";
        EVENTS_API_HOST: string;
        EVENTS_API_TARGET: string;
        SALES_URL: string;
        SESSION_KEY_SUFFIX: string;
        TERMINAL_SOCKET_URL: string;
        WEBINAR_URL: string;
        WHAT_IS_ZYBOOK_VIDEO_URL: string;
        ZYBOOKS_URL: string;
        ZYSERVER2_API_HOST: string;
        ZYSERVER2_DR_API_HOST: string;
    };
    contentSecurityPolicy: {
        "connect-src": string;
        "default-src": string;
        "font-src": string;
        "img-src": string;
        "media-src": string;
        "script-src": string;
        "style-src": string;
    };
    metricsAdapters: Array<{
        name: string;
        environments: string[];
        config: {
            id: string;
            debug: boolean;
            trace: boolean;
            sendHitTask: boolean;
            require: string[];
        };
    }>;
    moment: {
        includeTimezone: string;
    };
    newRelic: {
        agent: string;
        applicationId: string;
        licenseKey: string;
        spaMonitoring: boolean;
        beacon: string;
        errorBeacon: string;
    };
    stripe: {
        publishableKey: string;
    };
    "zy-ember-froala-editor": {
        key: string;
    };
    exportApplicationGlobal: boolean;
    "ember-websockets": {
        socketIO: boolean;
    };
    resourceHost: string;
    staticResourceHost: string;
    imageHost: string;
    zydeHost: string;
    terminalSocketUrl: string;
}

async function getRuntime(): Promise<ZyRuntimeConfiguration> {
    const dom = await getZyDOM();

    const meta: HTMLMetaElement = dom.window.document.querySelector('meta[name="zybooks-web/config/environment"]')!;
    return JSON.parse(decodeURIComponent(meta.content));
}

export async function getBuildKey(): Promise<string> {
    const { APP: { BUILDKEY } } = await getRuntime();

    return BUILDKEY;
}