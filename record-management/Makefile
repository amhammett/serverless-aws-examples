.PHONEY = help install deploy invoke remove local-invoke test

# pathing
ifeq ($(OS),Windows_NT)
    yarn_path := $(shell where yarn)
else
    yarn_path := $(shell which yarn)
endif

npm_jshint_path := ./node_modules/.bin/jshint
npm_lambda_local_path := ./node_modules/.bin/lambda-local
npm_mocha_path := ./node_modules/.bin/mocha
npm_serverless_path := ./node_modules/.bin/serverless
npm_yamllint_path := ./node_modules/.bin/yamllint

# vars
env := missing
profile := dev
region := us-west-2
stage := v1

# env vars
AWS_PARAMS=AWS_PROFILE=$(profile) AWS_DEFAULT_REGION=${region}
LAMBDA_PARAMS=ENV=$(env)

serverless_cmd := $(AWS_PARAMS) $(LAMBDA_PARAMS) $(npm_serverless_path)
lambda_local_cmd := $(AWS_PARAMS) $(LAMBDA_PARAMS) $(npm_lambda_local_path)

# help
help: ## this help text
	@echo 'Available targets'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# dev
install: ## install requirements
	yarn install

local-invoke: ## invoke function locally
	$(lambda_local_cmd) -t 20 -f $(function)

# test
test: | yaml-lint js-lint mocha ## test all the things

js-lint: ## lint js
	$(npm_jshint_path) src/*

mocha: ## mocha/chai tests
	$(npm_mocha_path)

yaml-lint: ## lint yaml
	$(npm_yamllint_path) *.yml

# deployment

deploy: ## deploy service
	$(AWS_PARAMS) aws s3api create-bucket --acl private --bucket serverless-deployment-$(region)-$(profile) --region $(region) --create-bucket-configuration LocationConstraint=$(region) || true
	$(serverless_cmd) deploy --stage $(stage)

invoke: ## invoke function
	${AWS_PARAMS} ENV=${env} ./node_modules/.bin/serverless invoke --stage ${stage} -f $(function)

remove: ## remove service
	$(serverless_cmd) remove --stage $(stage)
