import { beforeEach, describe, expect, it } from 'bun:test';
import { CommandContainer } from './container';

describe('CommandContainer', () => {
  beforeEach(() => {
    // Clear container before each test
    CommandContainer.clear();
  });

  it('should add and retrieve command entries', () => {
    const commandEntry = {
      name: 'test-command',
      description: 'Test command description',
      value: 'TestCommand',
    };

    CommandContainer.add(commandEntry);

    expect(CommandContainer.count()).toBe(1);
    expect(CommandContainer.values().next().value).toEqual(commandEntry);
  });

  it('should maintain multiple command entries', () => {
    const commandEntry1 = {
      name: 'test-command-1',
      description: 'Test command 1',
      value: 'TestCommand1',
    };

    const commandEntry2 = {
      name: 'test-command-2',
      description: 'Test command 2',
      value: 'TestCommand2',
    };

    CommandContainer.add(commandEntry1);
    CommandContainer.add(commandEntry2);

    expect(CommandContainer.count()).toBe(2);
    expect(Array.from(CommandContainer.values())).toEqual([
      commandEntry1,
      commandEntry2,
    ]);
  });

  it('should clear all command entries', () => {
    CommandContainer.add({
      name: 'test-command',
      value: 'TestCommand',
    });

    expect(CommandContainer.count()).toBe(1);

    CommandContainer.clear();

    expect(CommandContainer.count()).toBe(0);
  });
});
