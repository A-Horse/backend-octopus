pipeline {
    agent none
    triggers {
        pollSCM('*/1 * * * *')
    }
    environment {
        HOME = '.'
        CI = 'true' 
        OCTO_MYSQL_HOST     = credentials('jenkins-octopus-mysql-host')
        OCTO_MYSQL_USERNAME = credentials('jenkins-octopus-mysql-username')
        OCTO_MYSQL_PASSWORD = credentials('jenkins-octopus-mysql-password')
        OCTO_MONGO_URL      = credentials('jenkins-octopus-mongo-url')
        docker_hub_username = credentials('docker_hub_username')
        docker_hub_password = credentials('docker_hub_password')
    }
    stages {
        stage('AutoCheck') {
            agent {
                docker {
                    image 'node:12.14.0-stretch'
                }
            }
            stages {
                stage('Install') {
                    steps {
                        sh 'npm install'
                    }
                }
                stage('Test') {
                    steps {
                        sh 'npm test'
                    }
                }
            }
        }
        stage('Dockerize') {
            agent {
                docker {
                    image 'docker:19.03.5'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            stages {
                stage('Build Image') {
                    steps {
                        sh "docker build . -t fwchen/octopus-backend:latest"
                    }
                }
                stage('Registry Login') {
                    steps {
                        sh "echo $docker_hub_password | docker login -u $docker_hub_username --password-stdin"
                    }
                }
                stage('Publish image') {
                    steps {
                        sh 'docker push fwchen/octopus-backend:latest'
                        sh 'echo "fwchen/octopus-backend:latest" > .artifacts'
                        archiveArtifacts(artifacts: '.artifacts')
                    }
                }
                stage('Remove image') {
                    steps {
                        sh "docker image rm fwchen/octopus-backend:latest"
                    }
                }
            }
        }
    }
    post {
        always {
            rocketSend currentBuild.currentResult
        }
    }
}