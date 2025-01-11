import { spinner } from '@clack/prompts';

export const TaskPrompt = async (
  startMessage: string,
  task: () => Promise<void>,
  endMessage: string,
): Promise<void> => {
  const s = spinner();
  s.start(startMessage);
  await task();
  s.stop(endMessage);
};
