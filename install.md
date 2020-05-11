# IITrade Web Application

### For official deployment, please skip to Build VM Beta (OFFICIAL PROJECT DEPLOYMENT) section.

## Installations

### Node.js (Require)

- https://nodejs.org/en/download/

### PM2 (Required for deployment)

- sudo npm i pm2 -g

### MongoDB Community Edition (Require)

- https://docs.mongodb.com/manual/administration/install-community/

  - Follow the OS-specific documentation to *install* and *run* MongoDB (i.e. the mongod process) as a *service*
  - Make sure MongoDB Community Edition is running as a service

### Visual Studio Code (Require)

- https://code.visualstudio.com/?wt.mc_id=DX_841432

### MongoDB Compass (Optional)

- https://www.mongodb.com/download-center/compass

## TEST/DEV application locally

In your terminal, navigate to the locations and run the commands as following:

- Navigate to a directory where you want to clone the Team 03 Repo

  - command: *git clone https://github.com/illinoistech-itm/2020-team03r.git*

- Navigate to 2020-team03r/code/photo-sharing-app/ to install essential packages

  - command: *npm install*
  
- Navigatet to 2020-team03r/code/photo-sharing-app/backend/ and create a file named: **.env**

  - Add this line to **.env** file: **SERVER_IP=localhost**

- Navigate to 2020-team03r/code/photo-sharing-app/client/ to install essential packages

  - command: *npm install*

- Navigate to 2020-team03r/code/photo-sharing-app/ to start up the app (both server and client)

  - Command: *npm start*

    - Note: This will send you to your set/preferred browsers at http://localhost:3000/
## Certification (For development/testing only)
- Navigate to https://localhost:3007

- Click advanced, and proceed to website if asked.

- Navigate back to http://localhost:3000

## DEPLOY application locally or preferred host

In your terminal, navigate to the locations and run the commands as following:

- Navigate to a directory where you want to clone the Team 03 Repo

  - command: *git clone https://github.com/illinoistech-itm/2020-team03r.git*

- Navigate to 2020-team03r/code/photo-sharing-app/ to install essential packages

  - command: *npm install*
  
- Navigatet to 2020-team03r/code/photo-sharing-app/backend/ and create a file named: **.env**

  - Add this line to **.env** file: **SERVER_IP=localhost**
  (You can replace localhost any {PREFERRED IP})

- Navigate to 2020-team03r/code/photo-sharing-app/client/ to install essential packages and build client

  - command: *npm install*
  - command: *npm run build*
  - command: *mv build ../backend*

- Navigate to 2020-team03r/code/photo-sharing-app/backend to start up the app (both server and client)

  - command: *pm2 start server.js --name iitrade_server*

- Open your browser and navigate to *https://{PREFRRED_IP}:3007*. Accept certificate when ask. 

## Additional Troubleshooting Steps

- If node_modules exists, remove it by running the following command

  - *rm -r node_modules*

- To view data, open MongoDB Compass and use our connection string to view data

  - Connection string: mongodb://127.0.0.1:27017/test 

- If your browser does not accept the certificate, please try another browser.

- If you have proxy error, open *.env* file in */backend* make sure *SERVER_IP=localhost*


---
## Build VM Beta (OFFICIAL PROJECT DEPLOYMENT)
### Build Instruction
Before you start, Please Make sure you have Version 6.0.20 for Virtual Box and Version 2.2.6 for Vagrant.

- Add your rsa key (public key) as the delpoy key to this team repository

- Create a file named *"id_rsa_github_deploy_key"* inside the 2020-team03r/code/photo-sharing-app/build_script
  - Copy and paste your own rsa key (private key) into this file

- In Commmand Prompt, navigate to 2020-team03r/code/photo-sharing-app/build_script and run
  - command: *packer build team03r_script.json*
- The box should located under the same folder

- Add your box to vagrant
  - command: *vagrant box add team03r-Ub-svr-virtualbox-1587036331.box --name team03r*
  - The name of the box might be a little bit different

- In Commmand Prompt, navigate to 2020-team03r/code/photo-sharing-app/build_script and run the following command to initialize the vagrant environment
  - command: *vagrant init team03r*

- In your code editior, navigate to 2020-team03r/code/photo-sharing-app/build_script/Vagrantfile
  - uncomment line 35: config.vm.network "private_network", ip: "192.168.33.10"

- Bootup the machine with the command *vagrant up*

- After the box is running, open up a browser and navigate to https://192.168.33.10:3007
  - Click Advanced, and proceed to website if asked.


### Troubleshooting Steps
- If you meet the following issue:
  - "Vagrant was unable to mount VirtualBox shared folders..."
  - Run this command to solve: *vagrant plugin install vagrant-vbguest*
  - Then run the box again by: *vagrant reload*
- To stop the virtual machine, run *vagrant destroy*
