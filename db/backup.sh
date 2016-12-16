#!/bin/bash

$ENV='DEV'

mkdir -p data-backup
sqlite3 db-DEV.sqlite ".backup ./data-backup/bk_database.sq3.bak"
# date +"%m-%d-%y_%T"
