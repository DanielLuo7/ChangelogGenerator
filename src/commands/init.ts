import fs from "fs";
import path from "path";
import readline from "readline";
import os from "os";

function prompt(question: string): Promise<string> {
    const readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) =>
        readLine.question(question, (answer) => {
            readLine.close();
            resolve(answer.trim());
        })
    );
}

async function writeToShellConfig(key: string, value: string) {
    const shell = process.env.SHELL || "";
    const home = os.homedir();
    const targetFile = shell.includes("zsh") ? path.join(home, ".zshrc") : path.join(home, ".bashrc");

    const keyValue = `export ${key}=${value}`;
    const contents = fs.readFileSync(targetFile, "utf-8");

    if (!contents.includes(keyValue)) {
        fs.appendFileSync(targetFile, `\n${keyValue}\n`);
        console.log(`Added ${key}=${value} to ${targetFile}`);
    } else {
        console.log(`${key} already exists in ${targetFile}`);
    }

}

function appendToGitIgnore(file: string) {
    const gitIgnorePath = path.resolve(".gitignore")
    if (fs.existsSync(gitIgnorePath)) {
        const current = fs.readFileSync(gitIgnorePath, "utf-8");
        if (!current.includes(file)) {
            fs.appendFileSync(gitIgnorePath, `\n${file}\n`);
            console.log(`Wrote ${file} to gitignore.`);
        }
    } else {
        fs.writeFileSync(gitIgnorePath, `${file}\n`);
        console.log(`Created gitignore and added ${file}.`);
    }

}

export async function init() {
    console.log("Initializing requirements for your changelogger...");

    const apiKey = await prompt("Enter your OpenRouter API key: ")
    const storeGlobally = ((await prompt("Set your API key globally in shell config? (y/N)")).toLowerCase() === "y");

    if (storeGlobally) {
        await writeToShellConfig("API_KEY", apiKey);
    } else {
        const envPath = path.resolve(".env");
        fs.writeFileSync(envPath, `API_KEY=${apiKey}\n`);
        console.log("Written to .env file");
        appendToGitIgnore(envPath);
    }

}

