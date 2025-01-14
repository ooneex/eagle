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
	@bun build --target=node ./src/index.ts --outfile=dist/index.js
	@tsc --emitDeclarationOnly --project tsconfig.types.json
	# @bun publish --access public
