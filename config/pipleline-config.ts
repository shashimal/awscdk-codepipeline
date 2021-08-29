import {IPipelineConfigProps} from "../lib/PipelineConfigProps";
import {BuildSpecContent} from "./buildspec-content";
export const PipelineConfig: IPipelineConfigProps = {
    serviceName: 'driver-service',
    sourceStage: {
        repositoryName: 'driver-service'
    },
    buildStage: {
        ecrRepositoryName: 'driver-service',
        buildSpec: BuildSpecContent
    },
    deployStage: {},
    approvalStage: {
        notifyEmails: ['abc@gmail.com'],
        notifyTopic: 'arn:aws:sns:us-east-1:793209430381:driver-service-approval-notification'
    },
    notification: {
        slack: [
            {
                channelName: 'driver-service',
                channelId: 'driver-service-pipeline',
                workspaceId: 'T02CQ1XC99Q',
                arn: 'arn:aws:chatbot::793209430381:chat-configuration/slack-channel/driver-service-pipeline'
            }
        ]
    }
}