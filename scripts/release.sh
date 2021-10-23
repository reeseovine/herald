#!/usr/bin/env bash

# requires:
#   - jq
#   - yarn
#
# This script must be invoked from the project root. Use `yarn bundle-release` if unsure.

version=$(jq -r .version package.json)
if [ "$version" == "" ]; then
	echo "no version number detected! are you sure you're in the right directory?"
	exit 1
fi

file_list=(
	README.md
	sample.env
	package.json
	yarn.lock
	build/
	server/
)
release_path="release"
tmp_path="$(mktemp -d)"

copy_files(){
	cp -r ${file_list[@]} $tmp_path
}

mkzip(){
	pushd $tmp_path
	zip -r "$1/Herald-v${version}.zip" *
	popd
}

mktargz(){
	pushd $tmp_path
	tar czvf "$1/Herald-v${version}.tar.gz" *
	popd
}

main(){
	# create release_path
	if [ ! -d "$release_path" ]; then mkdir -p "$release_path"; fi

	# build react app
	yarn build

	# copy necessary files into temp dir
	copy_files

	# install just the production modules into the temp folder
	NODE_ENV=production yarn install --modules-folder "$tmp_path/node_modules"

	# generate archives
	mkzip "$PWD/$release_path"
	mktargz "$PWD/$release_path"

	echo "all done! 🎉"
}

main
