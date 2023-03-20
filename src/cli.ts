#!/usr/bin/env node

/* istanbul ignore file */
import 'reflect-metadata'

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'


import { ConfigCommand } from './commands/config.command'
import { SeedCommand } from './commands/seed.command'


yargs(hideBin(process.argv))
  .usage('Usage: $0 <command> [options]')
  .command(new ConfigCommand())
  .command(new SeedCommand())
  .recommendCommands()
  .demandCommand(1)
  .strict()
  .help('h')
  .alias('h', 'help').argv
