import fs from "fs";

export default function updateFile(path, products = []) {
    const data = ['name,price,quantity,promotion\n'];

    products.forEach(element => {
        data.push(`${element}`);
    })

    fs.writeFileSync(path, data.join(""));
}