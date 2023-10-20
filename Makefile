# Running dev web server
.PHONY: dev
dev:
	node scripts/dev.mjs

# Building website
.PHONY: build
build:
	node scripts/build.mjs

# Run react counter benchmark
.PHONY: react.counter
react.counter:
	node run.react.counter.mjs

# Run react fields benchmark
.PHONY: react.fields
react.fields:
	node run.react.fields.mjs
