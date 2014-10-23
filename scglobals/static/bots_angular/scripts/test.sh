#!/bin/bash

BASE_DIR=`dirname $0`

protractor $BASE_DIR/../config/protractor_conf.js $*
