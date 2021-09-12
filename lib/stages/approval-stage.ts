import {Stack} from "@aws-cdk/core";
import {ManualApprovalAction} from "@aws-cdk/aws-codepipeline-actions";
import {PipelineConfig} from "../../config/pipleline-config";
import {Topic} from "@aws-cdk/aws-sns";

export class ApprovalStage {

    private readonly stack: Stack;
    private readonly appName: string;

    constructor(stack: Stack) {
        this.stack = stack;
        this.appName = this.stack.node.tryGetContext("appName");

    }

    public getManualApprovalAction = (): ManualApprovalAction => {
        return new ManualApprovalAction({
            actionName: "QA-Approval",
            notifyEmails: PipelineConfig.approvalStage?.notifyEmails,
            notificationTopic: Topic.fromTopicArn(this.stack, `${this.appName}-QA-approval`, PipelineConfig.approvalStage?.notifyTopic)
        });
    }

}