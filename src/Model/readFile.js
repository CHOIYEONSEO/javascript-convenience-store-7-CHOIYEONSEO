import fs from "fs";

export default function readFile(path, option) {
    const data = fs.readFileSync(path, option);

    return data.split("\n").slice(1, -1);
}