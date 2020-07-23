const core = require('@actions/core');
const { context } = require('@actions/github');

try {
    const PRMeta = context.payload.pull_request;

    console.log(PRMeta);
} catch (error) {
    core.setFailed(error.message);
}