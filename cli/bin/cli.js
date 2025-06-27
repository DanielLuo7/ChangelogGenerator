#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const commander_1 = require("commander");
const generate_1 = require("./commands/generate");
const init_1 = require("./commands/init");
const program = new commander_1.Command();
program
    .name("changelogger")
    .description("Generates a changelog from git commit history")
    .version("0.1.0");
program
    .command("init")
    .description("Configure OpenRouter API key")
    .action(init_1.init);
program
    .command("generate")
    .description('Generate changelog based on git commit history')
    .option('--from <ref>', 'Start ref (commit, tag, or branch)')
    .option('--to <ref>', 'End ref (commit, tag, or branch)', 'HEAD')
    .option('--output <file>', 'Output file (default: stdout)')
    .option("--publish", 'Publish your changelog to changelog site')
    .action((opts) => {
    const outputModes = [opts.preview, opts.output, opts.publish];
    const selected = outputModes.filter(Boolean);
    if (selected.length == 0) {
        console.error("Please specify your output method");
        process.exit(1);
    }
    if (selected.length > 1) {
        console.error("Please only provide one output method");
    }
    (0, generate_1.generateChangelog)(opts);
});
program.parse();
