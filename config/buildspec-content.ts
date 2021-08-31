export const BuildSpecContent = {
    version: '0.2',
    phases: {
        install: {
            'runtime-versions': {
                java: 'corretto8'
            }
        },
        pre_build: {
            commands: [
                'echo login to DockerHub',
                'docker login -u $DOCKER_USER_NAME -p $DOCKER_USER_PASSWORD',
                'echo login to AWS ECR',
                'echo $ACCOUNT_ID.dkr.ecr.$ACCOUNT_REGION.amazonaws.com',
                '(aws ecr get-login-password --region $ACCOUNT_REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$ACCOUNT_REGION.amazonaws.com)',
                'COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)',
                'IMAGE_TAG=${COMMIT_HASH:=latest}'
            ]
        },
        build: {
            commands: [
                'echo Build started on `date`',
                'mvn clean install',
                'echo Building the Docker image...',
                'docker build -t $IMAGE_NAME:latest .',
                'docker tag $IMAGE_NAME:latest $ACCOUNT_ID.dkr.ecr.$ACCOUNT_REGION.amazonaws.com/$IMAGE_NAME:latest',
                'echo Build completed on `date`'
            ]
        },
        post_build: {
            commands: [
                'echo Build completed on `date`',
                'echo Pushing the Docker image...',
                'docker push  $ACCOUNT_ID.dkr.ecr.$ACCOUNT_REGION.amazonaws.com/$IMAGE_NAME:latest',
                'printf \'{"ImageURI":"%s"}\' $ECR_REPO:latest > imageDetail.json',
                'printf \'[{"name":"driver-service","imageUri":"%s"}]\' $ECR_REPO:latest > imagedefinitions.json',
                'echo Pushing Docker Image completed on `date`'
            ]
        }
    },
    artifacts: {
        files: [
            'imageDetail.json',
            'imagedefinitions.json',
            'appspec.yaml',
            'taskdef.json'
        ]
    }
}
