import {Stack} from "@aws-cdk/core";
import {INotificationRuleSource, INotificationRuleTarget, NotificationRule} from "@aws-cdk/aws-codestarnotifications";
import {ISlackNotificationConfig} from "./notification";
import {SlackChannelConfiguration} from "@aws-cdk/aws-chatbot";

export class PipelineNotification {
    private readonly stack: Stack;
    private readonly appName: string

    constructor(stack: Stack) {
        this.stack = stack;
        this.appName = this.stack.node.tryGetContext('appName');
    }

    public configureSlackNotifications = (source: INotificationRuleSource , slackConfig: ISlackNotificationConfig[]) => {
        new NotificationRule(this.stack, `${this.appName}-slack-notifications`, {
            events: [
                'codepipeline-pipeline-stage-execution-succeeded',
                'codepipeline-pipeline-stage-execution-failed',
                'codepipeline-pipeline-pipeline-execution-failed',
            ],
            source,
            targets: this.getSlackTargets(slackConfig)
        })
    };

    private getSlackTargets = (slackConfig: ISlackNotificationConfig[]): INotificationRuleTarget[] => {
        const targets: INotificationRuleTarget[] = []
        if (slackConfig && slackConfig.length > 0) {
            for (let config of slackConfig) {
                const slack = SlackChannelConfiguration.fromSlackChannelConfigurationArn(this.stack,
                    `${this.appName}-${config.channelName}-slack-channel-config`,
                    config.arn)
                targets.push(slack);
            }
        }
        return targets;
    }
}