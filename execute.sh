#!/bin/sh
cd /home/pi/workspace/git_repos/e-paper-manager/

flag=`cat isboot`
if [ $flag = 1 ];then
  npm start
fi
