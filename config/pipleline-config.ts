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
    deployStage: {
        dev: {
            clusterName: 'DriverServiceDev',
            vpcId: 'vpc-b9dbb0c4',
            securityGroup: '',
        },
        prod: {
            clusterName: 'DriverServiceProd',
            vpcId: 'vpc-b9dbb0c4',
            securityGroup: 'sg-02537d092ba986307'

        },
    },
    approvalStage: {
        notifyEmails: ['shashimald@gmail.com'],
        notifyTopic: 'arn:aws:sns:us-east-1:000:driver-service-approval-notification'
    },
    notification: {
        slack: [
            {
                channelName: 'driver-service-slack',
                channelId: 'C02EBB23W7N',
                workspaceId: 'T02CQ1XC99Q',
                arn: 'arn:aws:chatbot::0000:chat-configuration/slack-channel/driver-service-slack'
            }
        ]
    }
}