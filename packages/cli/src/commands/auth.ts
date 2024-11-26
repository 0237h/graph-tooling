import { print, prompt } from 'gluegun';
import { Args, Command, Flags, ux } from '@oclif/core';
import { saveDeployKey } from '../command-helpers/auth.js';
import { chooseNodeUrl } from '../command-helpers/node.js';

export default class AuthCommand extends Command {
  static description = 'Sets the deploy key to use when deploying to a Graph node.';

  static args = {
    'deploy-key': Args.string(),
  };

  static flags = {
    help: Flags.help({
      char: 'h',
    }),
  };

  async run() {
    let {
      args: { 'deploy-key': deployKey },
    } = await this.parse(AuthCommand);

    const { node } = chooseNodeUrl({});

    deployKey = await prompt.ask<string>([
      {
        type: 'invisible',
        name: 'deployKey',
        message: () => 'What is the deploy key?',
        initial: deployKey,
        required: true,
        validate: value =>
          value.length > 200
            ? ux.error('✖ Deploy key must not exceed 200 characters', { exit: 1 })
            : value,
      },
    ]);

    try {
      await saveDeployKey(node!, deployKey);
      print.success(`Deploy key set for ${node}`);
    } catch (e) {
      this.error(e, { exit: 1 });
    }
  }
}
