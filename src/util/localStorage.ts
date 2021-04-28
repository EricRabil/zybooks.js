import fs from "fs";
import path from "path";

const storagePath = path.resolve(__dirname, "..", "..");
const makePath = (key: string) => path.resolve(__dirname, "..", "..", `storage.${key}.json`)

const getAll = () => fs.readdirSync(storagePath).filter(file => file.startsWith("storage.") && file.endsWith(".json"));

export const localStorage: Storage = Object.defineProperties({
    clear: () => {
        getAll().forEach(file => fs.unlinkSync(path.resolve(storagePath, file)));
    },
    getItem: (key: string) => {
        try {
            return fs.readFileSync(makePath(key)).toString();
        } catch {
            return null;
        }
    },
    key: (index: number) => getAll()[index]?.split(".").slice(1, -1),
    setItem: (key: string, value: string) => {
        fs.writeFileSync(makePath(key), value);
    },
    removeItem: (key: string) => {
        try {
            fs.unlinkSync(makePath(key));
        } catch {}
    }
}, {
    length: {
        get() {
            return getAll().length;
        }
    }
})