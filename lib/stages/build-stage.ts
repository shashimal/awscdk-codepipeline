import {Stack} from "@aws-cdk/core";
import {CodeBuildAction} from "@aws-cdk/aws-codepipeline-actions";
import {Artifact} from "@aws-cdk/aws-codepipeline";
import {BuildSpec, Cache, LinuxBuildImage, LocalCacheMode, PipelineProject} from "@aws-cdk/aws-codebuild";
import {PipelineConfig} from "../../config/pipleline-config";
import {ManagedPolicy} from "@aws-cdk/aws-iam";
import {IRepository, Repository} from "@aws-cdk/aws-ecr";

export class BuildStage {
    private readonly stack: Stack;
    private readonly appName: string;
    private readonly ecrRepository: IRepository
    private readonly buildOutput : Artifact;

    constructor(stack: Stack) {
        this.stack = stack;
        this.appName = this.stack.node.tryGetContext('appName');
        this.ecrRepository = Repository.fromRepositoryName(this.stack, `EcrRepo-${PipelineConfig.serviceName}`,PipelineConfig.buildStage.ecrRepositoryName);
        this.buildOutput = new Artifact();
    }

    public getCodeBuildAction = (sourceOutput: Artifact): CodeBuildAction => {
        return new CodeBuildAction({
            actionName: "Build-Action",
            input: sourceOutput,
            project: this.createCodeBuildProject(),
            outputs: [this.buildOutput]
        });
    }

    private createCodeBuildProject = (): PipelineProject => {
        const codeBuildProject = new PipelineProject(this.stack, `${this.stack.node.tryGetContext('appName')}-Codebuild-Project`, {
            projectName: `${this.appName}-Codebuild-Project`,
            environment: {
                buildImage: LinuxBuildImage.STANDARD_5_0,
                privileged: true,
            },
            environmentVariables: this.getEnvironmentVariables(),
            buildSpec: BuildSpec.fromObject(this.getBuildSpec()),
            cache: Cache.local(LocalCacheMode.DOCKER_LAYER, LocalCacheMode.CUSTOM),
        });

        console.log(BuildSpec.fromSourceFilename("config/buildspec-ecr.yaml").toBuildSpec())

        codeBuildProject.role?.addManagedPolicy(
            ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryPowerUser')
        );
        return codeBuildProject;
    }

    private getBuildSpec = () => {
        const configBuildSpecObject = PipelineConfig.buildStage.buildSpec;
        const imageDetail = 'printf \'{"ImageURI":"%s"}\' $ECR_REPO:latest > imageDetail.json';
        const phases = {
            ...configBuildSpecObject.phases,
            post_build: {
                commands: [...configBuildSpecObject.phases.post_build.commands,
                    imageDetail
                ]
            }
        };
        return {...configBuildSpecObject, phases};
    }

    private getEnvironmentVariables = () => {
        let configEnvObject = PipelineConfig.buildStage.environmentVariables;
        return {
            ...configEnvObject,
            ACCOUNT_ID: {
                value: this.stack.account
            },
            ACCOUNT_REGION: {
                value: this.stack.region
            },
            ECR_REPO: {
                value: this.ecrRepository.repositoryUri
            },
            IMAGE_NAME: {
                value: PipelineConfig.serviceName
            }
        };
    }

    public getBuildOutput = (): Artifact => {
        return this.buildOutput;
    }
}