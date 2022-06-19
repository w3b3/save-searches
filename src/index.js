#!/usr/bin/env node

const { program } = require("commander");

/* Capture all the CLI inputs */
program.parse(process.argv);

/* Let's use all the captured values */
const searchTerm = program.args.join(" ");
console.log({ searchTerm });
