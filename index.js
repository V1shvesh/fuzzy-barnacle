const core = require('@actions/core');
const { context } = require('@actions/github');

const LABEL_CODEPUSH = 'codepush';
const LABEL_QA_PASSED = 'QA passed';

try {
    const PRMeta = context.payload.pull_request;
    const baseRef = PRMeta.base.ref;
    const labels = PRMeta.labels.map(label => label.name);
    console.log(baseRef, labels, context.action, context.payload.label);
    
    switch (context.action) {
        case 'opened':
        case 'edited': {

            const isCodePush = labels.includes(LABEL_CODEPUSH);

            if (isCodePush) {
                performCodePushChecks(baseRef, labels);
            }
            break;
        }
        case 'labeled':
        case 'unlabeled': {
            const label = context.payload.label.name;
            if ([LABEL_CODEPUSH, LABEL_QA_PASSED].includes(label)) {
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
