import debug from "debug";

export const RootLog = debug("zybooks");

export function ZBMakeLog(namespace: string) {
    return RootLog.extend(namespace, ".");
}
