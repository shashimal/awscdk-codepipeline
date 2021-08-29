import {Stack} from "@aws-cdk/core";
import {CodeDeployEcsDeployAction} from "@aws-cdk/aws-codepipeline-actions";
import {Artifact} from "@aws-cdk/aws-codepipeline";
import {PipelineConfig} from "../../config/pipleline-config";
import {EcsApplication, EcsDeploymentGroup, IEcsDeploymentGroup} from "@aws-cdk/aws-codedeploy";

export class DeployStage {
    private readonly stack: Stack;
    private readonly appName: string

    constructor(stack: Stack) {
        this.stack = stack;
        this.appName = this.stack.node.tryGetContext("appName");
    }

    public getCodeDeployEcsDeployAction = (env: String, buildArtifact: Artifact): CodeDeployEcsDeployAction => {
        const ecsApplication = EcsApplication.fromEcsApplicationName(this.stack,
            `${this.appName}-EcsCodeDeploymentApp`, PipelineConfig.serviceName);

        const deploymentGroup: IEcsDeploymentGroup = EcsDeploymentGroup.fromEcsDeploymentGroupAttributes(this.stack,
            `${this.appName}-EcsCodeDeploymentGroup-${env}`, {
                deploymentGroupName: `${PipelineConfig.serviceName}-${env}`,
                application: ecsApplication
            });

        return new CodeDeployEcsDeployAction({
            actionName: `${this.appName}-EcsCodeDeploymentAction-${env}`,
            deploymentGroup,
            taskDefinitionTemplateInput: buildArtifact,
            appSpecTemplateInput: buildArtifact,
            containerImageInputs: [{
                input: buildArtifact,
                taskDefinitionPlaceholder: "IMAGE1_NAME"
            }]
        });
    }
}