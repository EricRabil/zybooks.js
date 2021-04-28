import debug from "debug";
import { ZySession, ZyUser } from "./types/user";
import axios from "axios";
import { ZyBook, ZyFullBook } from "./types/book";
import { ZyContentResourceMetadata } from "./types/assignment";
import { ZyAssignment } from "./types/assignment";
import { localStorage } from "./util/localStorage";
import { ZySubmission, ZyGradingCriteria } from "./types/submission";

interface ZyLoginResponse {
    session: ZySession;
    success: boolean;
    user: ZyUser;
}

interface ZyItemsResponse {
    success: boolean;
    items: Record<string, ZyBook[]>;
}

interface ZyFullBookResponse {
    success: boolean;
    zybooks: ZyFullBook[];
}

interface ZyAssignmentsResponse {
    success: boolean;
    assignments: ZyAssignment[];
}

interface ZyActivitiesResponse {
    content_resource_metadata: ZyContentResourceMetadata[][][];
    data: Record<string, number[]>[][];
    latest_best_submissions: Record<string, null | ZySubmission[]>;
    manual_grade_data: Record<string, ZyGradingCriteria[]>;
    success: boolean;
    user_id: number;
}

class ZyError extends Error {
    constructor(public code: number, message: string) {
        super(message);
        this.name = "ZyError";
    }
}

export class ZyClient {
    #email: string;
    #password: string;
    #session: ZySession | null = null;
    #user: ZyUser | null = null;

    #client = axios.create({ baseURL: "https://zyserver.zybooks.com/v1/" })

    constructor(email: string, password: string) {
        this.#email = email;
        this.#password = password;

        const cachedStorage = localStorage.getItem("cached-session");
        if (cachedStorage) {
            const { session, user } = JSON.parse(cachedStorage);
            this.#session = session;
            this.#user = user;
        }

        this.#client.interceptors.request.use(config => {
            if (!this.#session) return config;
            if (!config.params) config.params = {};
            config.params.auth_token = this.#session?.auth_token;

            return config;
        });

        this.#client.interceptors.response.use(async res => {
            if (typeof res.data === "object" && res.data.success === false) {
                throw new ZyError(res.data.error.code, res.data.error.message);
            }

            return res;
        });
    }

    async login(): Promise<ZyUser> {
        const { data: { session, user } } = await this.#client.post<ZyLoginResponse>("signin", {
            email: this.#email,
            password: this.#password
        });

        this.#session = session;
        this.#user = user;

        localStorage.setItem("cached-session", JSON.stringify({ session, user }));

        return user;
    }

    async books(): Promise<ZyBook[]> {
        const { data: { items } } = await this.#client.get<ZyItemsResponse>(`user/${this.userID}/items`, {
            params: {
                items: '["zybooks"]'
            }
        })

        return Object.values(items).flat();
    }

    async book(id: string): Promise<ZyFullBook> {
        const { data: { zybooks: [ book ] } } = await this.#client.get<ZyFullBookResponse>("zybooks", {
            params: {
                zybooks: JSON.stringify([ id ])
            }
        })

        return book;
    }

    async activities(id: string): Promise<ZyActivitiesResponse> {
        const { data } = await this.#client.get<ZyActivitiesResponse>(`zybook/${id}/activities/${this.userID}`);

        return data;
    }

    async assignments(id: string): Promise<ZyAssignment[]> {
        const { data: { assignments } } = await this.#client.get<ZyAssignmentsResponse>(`zybook/${id}/assignments`);

        return assignments;
    }

    logout(): void {
        this.#session = this.#user = null;
    }

    get userID(): number {
        if (!this.#user) return NaN;

        return this.#user.user_id;
    }

    get expired(): boolean {
        if (!this.#session) return true;
        
        return Date.now() >= Date.parse(this.#session.expiry_date);
    }

    get loggedIn(): boolean {
        return this.#session !== null;
    }
}