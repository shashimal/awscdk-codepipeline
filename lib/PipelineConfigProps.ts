import {ISlackNotificationConfig} from "./notifications/notification";

export interface IPipelineConfigProps {
    serviceName: string;
    sourceStage: ISourceStage;
    buildStage: IBuildStage;
    approvalStage: IApprovalStage;
    notification: INotification;
    deployStage: IDeployStage;
}

export interface ISourceStage {
    repositoryName: string;
}

export interface IBuildStage {
    ecrRepositoryName: string
    buildSpec: any
}

export interface IDeployStage {
    prod: IDeployStageParam;
    dev: IDeployStageParam;
}

export interface IDeployStageParam {
    clusterName: string,
    vpcId: string,
    securityGroup: string
}

export interface IApprovalStage {
    notifyEmails: string[];
    notifyTopic: string;
}

export interface INotification {
    slack: ISlackNotificationConfig[]
}