const core = require('@actions/core');
const { context } = require('@actions/github');

const LABEL_CODEPUSH = 'codepush';
const LABEL_QA_PASSED = 'QA passed';

try {
    const PRMeta = context.payload.pull_request;
    const baseRef = PRMeta.base.ref;
    const labels = PRMeta.labels.map(label => label.name);
    const action = context.payload.action;
    console.log(baseRef, labels);
    
    switch (action) {
        case 'opened':
        case 'edited':
        case 'labeled':
        case 'unlabeled': {
            const isCodePush = labels.includes(LABEL_CODEPUSH);

            if (isCodePush) {
                performCodePushChecks(baseRef, labels);
            }
            break;
        }
        default:
            break;
    }
} catch (error) {
    core.setFailed(error.message);
}

function performCodePushChecks(baseRef, labels) {
    if (baseRef !== 'release') {
        throw new Error('Please set the base branch to release');
    }
    else if (!labels.includes(LABEL_QA_PASSED)) {
        throw new Error('Please get QA approval');
    }
}
