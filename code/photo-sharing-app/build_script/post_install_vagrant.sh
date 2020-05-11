#!/bin/bash
set -e
set -v

# http://superuser.com/questions/196848/how-do-i-create-an-administrator-user-on-ubuntu
# http://unix.stackexchange.com/questions/1416/redirecting-stdout-to-a-file-you-dont-have-write-permission-on
# This line assumes the user you created in the preseed directory is vagrant
echo "%admin  ALL=NOPASSWD: ALL" | sudo tee -a /etc/sudoers.d/init-users
sudo groupadd admin
sudo usermod -a -G admin vagrant

# Installing Vagrant keys
wget --no-check-certificate 'https://raw.github.com/mitchellh/vagrant/master/keys/vagrant.pub'
sudo mkdir -p /home/vagrant/.ssh
sudo chown -R vagrant:vagrant /home/vagrant/.ssh
cat ./vagrant.pub >> /home/vagrant/.ssh/authorized_keys
sudo chown -R vagrant:vagrant /home/vagrant/.ssh/authorized_keys
echo "All Done!"

#http://www.fail2ban.org/wiki/index.php/MANUAL_0_8#Jails
sudo apt-get update
sudo apt-get install -y fail2ban
sudo sed -i "s/bantime = 600/bantime = -1/g" /etc/fail2ban/jail.conf
sudo systemctl enable fail2ban
sudo service fail2ban restart

################################################################################################################
# Keep the above lines to make sure that Vagrant will work seamlessly                                          #
################################################################################################################

# enable and allow ports in firewall
# https://serverfault.com/questions/790143/ufw-enable-requires-y-prompt-how-to-automate-with-bash-script
ufw --force enable
ufw allow proto tcp to 0.0.0.0/0 port 22
ufw allow proto tcp to 0.0.0.0/0 port 80
ufw allow proto tcp to 0.0.0.0/0 port 443
ufw allow proto tcp to 0.0.0.0/0 port 3000
ufw allow proto tcp to 0.0.0.0/0 port 3006
ufw allow proto tcp to 0.0.0.0/0 port 3007
###############################################################################
# Replace any occurance of hajek with the name of your own private repository #
###############################################################################
#mkdir /home/vagrant/project
sudo chown -R vagrant:vagrant ~/2020-team03r

##################################################
# Add User customizations below here
##################################################
sudo apt-get install -y npm
sudo apt-get install -y node.js
#Clear NPM's cache:
sudo npm cache clean -f
#Install a little helper called 'n'
sudo npm install -g n

sudo npm install pm2 -g
#Install latest stable Node.js version
sudo n stable
#Alternatively pick a specific version and install like this:
#sudo n 0.8.20
#https://stackoverflow.com/questions/8191459/how-do-i-update-node-js
# git@github.com:illinoistech-itm/2020-team03r.git
#
# https://github.com/illinoistech-itm/2020-team03r.git
#

################
# Install mongodb  #
################

sudo wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list

sudo apt-get update

sudo apt-get install -y mongodb-org

cd /tmp

ls /tmp

sudo service mongod start

sudo service mongod status

sudo systemctl enable mongod


################
# Run Client  #
################
#install dependecies for backend
cd /home/vagrant/2020-team03r/code/photo-sharing-app/
sudo npm install

#install dependencies for client
cd /home/vagrant/2020-team03r/code/photo-sharing-app/client/
sudo npm install

#Build client
npm run build

#remove build if exist
#sudo rm -r ../backend/build
#move "build" to backend
sudo mv build ../backend

cd ../backend
sudo echo "SERVER_IP=0.0.0.0" > .env

#start server with pm2
sudo pm2 start server.js --name iitrade_server
sudo pm2 save
sudo pm2 startup
