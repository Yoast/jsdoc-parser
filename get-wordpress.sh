#!/usr/bin/env bash

DIRECTORY=wordpress

if [ ! -d "$DIRECTORY" ]; then
	git clone git://develop.git.wordpress.org/ "$DIRECTORY"
fi

cd wordpress
git pull origin master
