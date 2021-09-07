import {CodeCommitSourceAction} from "@aws-cdk/aws-codepipeline-actions";
import {IRepository, Repository} from "@aws-cdk/aws-codecommit";
import {Stack} from "@aws-cdk/core";
import {PipelineConfig} from "../../config/pipleline-config";
import {Artifact} from "@aws-cdk/aws-codepipeline";

export class SourceStage {
    private readonly repository: IRepository;
    private stack: Stack;
    private readonly sourceOutput: Artifact;

    constructor(stack: Stack) {
        this.stack = stack;
        this.sourceOutput = new Artifact();
        this.repository = Repository.fromRepositoryName(stack,
            `${this.stack.node.tryGetContext("appName")}-${PipelineConfig.sourceStage.repositoryName}`,
            PipelineConfig.sourceStage.repositoryName);
    }

    public getCodeCommitSourceAction = (): CodeCommitSourceAction => {
        return new CodeCommitSourceAction({
            actionName: "Source-Action",
            output: this.sourceOutput,
            repository: this.repository
        });
    }

    public getSourceOutput = (): Artifact => {
        return this.sourceOutput;
    }
}