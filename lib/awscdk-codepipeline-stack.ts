import * as cdk from '@aws-cdk/core';
import {Pipeline} from "@aws-cdk/aws-codepipeline";
import {SourceStage} from "./stages/source-stage";
import {BuildStage} from "./stages/build-stage";
import {DeployStage} from "./stages/deploy-stage";
import {ApprovalStage} from "./stages/approval-stage";
import {PipelineNotification} from "./notifications/pipeline-notification";
import {PipelineConfig} from "../config/pipleline-config";

export class AwscdkCodepipelineStack extends cdk.Stack {

    private readonly appName: string;
    private readonly codepipeline: Pipeline;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.appName = this.node.tryGetContext("appName");

        this.codepipeline = new Pipeline(this, this.appName, {
            crossAccountKeys: false
        })

        //Source Stage
        const sourceStage = new SourceStage(this);
        this.codepipeline.addStage({
            stageName: "Source",
            actions: [sourceStage.getCodeCommitSourceAction()],
        });

        //Build Stage
        const buildStage = new BuildStage(this);
        this.codepipeline.addStage({
            stageName: "Build",
            actions: [buildStage.getCodeBuildAction(sourceStage.getSourceOutput())]
        });

        //Staging Stage

        //Approval Stage
        const approvalStage = new ApprovalStage(this);
        this.codepipeline.addStage({
            stageName: "Approval",
            actions: [approvalStage.getManualApprovalAction()]
        });

        //Deploy to DEV and SIT Stages
        const deployStageDev = new DeployStage(this);
        this.codepipeline.addStage({
            stageName: "Deploy-Prod",
            actions: [deployStageDev.getCodeDeployEcsDeployAction("dev", buildStage.getBuildOutput())]
        });

        //Configure notifications for the pipeline events
        const pipelineNotification = new PipelineNotification(this);
        pipelineNotification.configureSlackNotifications(this.codepipeline, PipelineConfig.notification.slack);
    }
}
