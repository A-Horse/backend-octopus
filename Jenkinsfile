pipeline {
    agent {
        docker {
            image 'node:12.14.0-stretch'
        }
    }
    triggers {
        pollSCM('*/1 * * * *')
    }
    environment {
        CI = 'true' 
        OCTO_MYSQL_HOST     = credentials('jenkins-octopus-mysql-host')
        OCTO_MYSQL_USERNAME = credentials('jenkins-octopus-mysql-username')
        OCTO_MYSQL_PASSWORD = credentials('jenkins-octopus-mysql-password')
        OCTO_MONGO_URL      = credentials('jenkins-octopus-mongo-url')
    }
    stages {
        stage('Npm install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test' 
            }
        }
    }
    post {
        always {
            rocketSend currentBuild.currentResult
        }
    }
}