#!/usr/bin/env bash

# requires:
#   jq

filelist=(
	README.md
	sample.env
	package.json
	yarn.lock
	build/
	server/
)
version=$(jq -r .version package.json)
releasepath="./release/"

mkzip(){
	zip -r "${releasepath}/Herald-v${version}.zip" ${filelist[@]}
}

mktargz(){
	tar czvf "${releasepath}/Herald-v${version}.tar.gz" ${filelist[@]}
}

main(){
	cd "$( dirname "${BASH_SOURCE[0]}" )"

	# create releasepath
	if [ ! -d "$releasepath" ]; then mkdir -p "$releasepath"; fi

	build react app
	yarn build

	mkzip
	mktargz

	echo "all done! 🎉"
}

main
