#!/usr/bin/env node

import "dotenv/config"
import { Command } from "commander";
import { generateChangelog } from "./commands/generate";
import { init } from "./commands/init";

const program = new Command();

program
    .name("changelogger")
    .description("Generates a changelog from git commit history")
    .version("0.1.0");

program
    .command("init")
    .description("Configure OpenRouter API key")
    .action(init)

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
            console.error("Please specify your output method")
            process.exit(1);
        } 
        if (selected.length > 1) {
            console.error("Please only provide one output method")
        }
        generateChangelog(opts);
    });


program.parse()
