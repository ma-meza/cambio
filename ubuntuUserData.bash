#!/bin/bash -x
sudo apt-get update
sudo apt install awscli -y
sudo apt-get install ruby -y
cd /home/ubuntu
wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
chmod +x /home/ubuntu/install
sudo /home/ubuntu/install auto
cd
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
source ~/.bashrc
nvm install 10.23.1
cat <<EOF >> /home/ubuntu/.bashrc
export NVM_DIR="/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
EOF
sudo apt-get install nginx -y
sudo rm /etc/nginx/sites-enabled/default
cd /etc/nginx/sites-available/
sudo wget https://hipwork-nginx-config.s3.amazonaws.com/nginxConfig
sudo ln -s /etc/nginx/sites-available/nginxConfig /etc/nginx/sites-enabled/nginxConfig
sudo service nginx restart
npm i -g pm2
cd ~
aws s3 sync s3://main-server-prod/ .
cd backend
sudo chown -R ubuntu /home/ubuntu/backend
npm install
pm2 start server.js
pm2 startup
sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v10.23.0/bin /home/ubuntu/.nvm/versions/node/v10.23.0/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save