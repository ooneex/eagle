test:
	@bun test

test.watch:
	@bun test --watch

test.coverage:
	@bun test --coverage

test.coverage.watch:
	@bun test --coverage --watch

fmt:
	@bunx @biomejs/biome check --write .

lint:
	@tsc --noEmit && bunx @biomejs/biome check .
