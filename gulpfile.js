const gulp = require('gulp');
const path = require('path');

const tasks = require('./main.js');
tasks.config.sassInput = path.resolve(__dirname, './test/main.scss');
tasks.config.cssDist = path.resolve(__dirname, './test/dist');
tasks.registerTasks(gulp, tasks.config);
