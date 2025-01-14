test:
	@bun test

test.watch:
	@bun test --watch

test.coverage:
	@bun test --coverage

test.coverage.watch:
	@bun test --coverage --watch

fmt:
	@bun run fmt

lint:
	@bun run lint

login:
	@bunx npm login

publish:
	# @bun build ./src/index.ts --outdir ./dist --splitting --minify --format esm --target bun
	@tsc --emitDeclarationOnly --project tsconfig.types.json
	@bun build.ts
