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
	@bun run lint
	@bunx jsr publish --allow-dirty
	# @bun publish --access public
	@git push
