import { describe, expect, it } from 'bun:test';
import {
  CommandContainer,
  CommandDecoratorException,
  command,
} from '@/command';
import { container } from '@/container';

describe('Command Decorator', () => {
  it('should register a valid command class in the container', () => {
    @command()
    class TestCommand {
      public execute() {
        return 'test';
      }
    }

    const instance = container.get<TestCommand>(TestCommand);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestCommand);
    expect(instance.execute()).toBe('test');
  });

  it('should register command with custom description', () => {
    @command('Custom description')
    class CustomCommand {
      public execute() {}
    }

    const commands = Array.from(CommandContainer.values());
    const customCommand = commands.find((c) => c.name === 'CustomCommand');

    expect(customCommand).toBeDefined();
    expect(customCommand?.description).toBe('Custom description');
    expect(customCommand?.value).toBe(CustomCommand);
  });

  it('should register command class with transient scope', () => {
    @command(undefined, 'transient')
    class TransientCommand {
      public execute() {}
    }

    const instance1 = container.get<TransientCommand>(TransientCommand);
    const instance2 = container.get<TransientCommand>(TransientCommand);
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register command class with singleton scope by default', () => {
    @command()
    class SingletonCommand {
      public execute() {}
    }

    const instance1 = container.get<SingletonCommand>(SingletonCommand);
    const instance2 = container.get<SingletonCommand>(SingletonCommand);
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should throw error when decorator is used on invalid class', () => {
    expect(() => {
      @command()
      // biome-ignore lint/correctness/noUnusedVariables: test case
      class InvalidClass {
        // Missing execute method
      }
    }).toThrow(CommandDecoratorException);

    expect(() => {
      @command()
      // biome-ignore lint/correctness/noUnusedVariables: test case
      class NotACommandClass {
        public execute() {}
      }
    }).toThrow(CommandDecoratorException);
  });

  it('should properly inject dependencies in command classes', () => {
    @command()
    class DependencyCommand {
      public execute() {}
    }

    @command()
    class InjectedCommand {
      constructor(public dependency: DependencyCommand) {}

      public execute() {}
    }

    const instance = container.get<InjectedCommand>(InjectedCommand);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedCommand);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyCommand);
  });
});
