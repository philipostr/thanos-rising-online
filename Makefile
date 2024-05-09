init:
	git config core.hooksPath .githooks
	@echo -e "\n\033[0;31mPlease appropriately replace all instances of <TEMPLATE> in the following files:\033[0m"
	@scripts/actualizeTemplates -p
	@echo
	mkdir -p sensitiveTemplates/gitlessTrack
