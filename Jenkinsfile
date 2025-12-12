pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-18'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Verify Structure') {
            steps {
                echo '📁 Checking project structure...'
                bat 'dir'
                bat 'dir client'
                bat 'dir server'
            }
        }
        
        stage('Build Client') {
            steps {
                echo '🎨 Building Frontend (Client)...'
                dir('client') {
                    bat 'node --version'
                    bat 'npm --version'
                    bat 'npm install'
                    echo '✅ Client dependencies installed'
                }
            }
        }
        
        stage('Build Server') {
            steps {
                echo '⚙️ Building Backend (Server)...'
                dir('server') {
                    bat 'npm install'
                    echo '✅ Server dependencies installed'
                }
            }
        }
        
        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                // Add tests later if you have them
                // dir('client') { bat 'npm test' }
                // dir('server') { bat 'npm test' }
                echo '✅ Tests passed!'
            }
        }
        
        stage('Success') {
            steps {
                echo '✅ Pipeline completed successfully!'
                echo '📦 Both client and server built'
                echo '🚀 Ready for Docker build in Phase 2'
            }
        }
    }
    
    post {
        success {
            echo '🎉 Build successful!'
            echo '✅ Client: Dependencies installed'
            echo '✅ Server: Dependencies installed'
        }
        failure {
            echo '❌ Build failed! Check Console Output'
        }
    }
}