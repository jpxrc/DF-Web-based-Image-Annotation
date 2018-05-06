#!/bin/bash


`touch file_log.txt`;
`echo $1 $2 $3 $4 $5 $6 $7 $8 > file_log.txt`;
exec /usr/local/bin/vips $1 $2 $3 $4 $5 $6 $7 $8;
#exec  /usr/local/bin/vips --version  > file_log.txt;
