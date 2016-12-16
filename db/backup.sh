#!/bin/bash

DEV='DEV'
if test $1=='dev'
then
    ENV='DEV'
else if test $1=='product'
     then
         ENV='PRODUCT'
     fi
fi
DATE_STR=`date +%Y-%m-%d_%H_%M_%S`
mkdir -p data-backup
sqlite3 db-$ENV.sqlite ".backup ./data-backup/db-"$ENV"-"$DATE_STR".sq3.bak"

