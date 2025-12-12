pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                echo '🔨 Building application...'
                // For Node.js project
                bat 'npm install'
            }
        }
        
        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                // Add your test commands here
                echo 'Tests passed!'
            }
        }
        
        stage('Success') {
            steps {
                echo '✅ Pipeline completed successfully!'
                echo 'Ready for Docker build in Phase 2'
            }
        }
    }
    
    post {
        success {
            echo '🎉 Build successful!'
        }
        failure {
            echo '❌ Build failed!'
        }
    }
}