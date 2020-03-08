import * as core from '@actions/core';

async function run() {
  try {
    console.log('test 1');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
