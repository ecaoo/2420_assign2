# 2420 Assignment 2
Author Eric Cao A01025661

Server IP: [http://64.225.88.13/](http://64.225.88.13/)
           [http://64.225.88.13/api](http://64.225.88.13/api)
           
# Table of contents
- Required Setup Video
- Create new regular users
- Installing caddy on both droplets
- Creating web app
- Caddy file
- Installing node and volta for 2 droplets
- Copying files from WSL
- Node
- Write service files
- Starting service files
- Check load balancer to ensure everything is functional

# Required Setup video
> Important to watch before going any further!
[VPC, droplets, load balancer, and firewall setup](https://vimeo.com/775412708/4a219b37e7)

# Create new regular users
**These steps are for both servers (server-one, server-two)**

1. Assuming everything went smooth in setting up from the video you can now start by SSH into server-one by using `ssh -i ~/.ssh/<your_key> root@<your server ip>`.
2. Create a new user by using `useradd -ms /bin/bash <user>`.
3. Register a password for the new user `passwd <user>`.
-Note: I would use the same password as your username to lessen the confusion between servers
4. Copy ssh file to users new home directory `rsync --archive --chown=<user>:<user> ~/.ssh /home/<user>


![1](https://user-images.githubusercontent.com/97474900/205421765-31b9749f-29af-4133-a9b5-2d8d48c8a441.png)

5. You should now verify the users home directory exists in `/home` and `.ssh` exists inside the users home directory

![2](https://user-images.githubusercontent.com/97474900/205421841-7a6f82ee-1e7b-4218-a3d6-d7c1453dfea2.png)

6. Try to SSH into new user by using `ssh -i ~/.ssh/<ssh_key> <user>@<server ip>`
7. Configure the `sshd_config` file using `sudo vim /etc/ssh/sshd_config`
8. Scroll down to the section where it says **PermitRootLogin** and change it from yes to no

![3](https://user-images.githubusercontent.com/97474900/205421956-9cd86b9e-fa98-4e9d-bed0-05dcae119e3f.png)

- Note you need to be in **INSERT MODE** by pressing i and then save by pressing escape key and `:wq` to save file!

9. `sudo systemctl restart ssh` to apply changes` You now cannot SSH into the root user from the terminal anymore
10. Finally use `sudo apt update` then followed up by `sudo apt upgrade`
Congratualations you have now created a new user and configured system updates for your server!

# Installing Caddy for both droplets
1. run the following command ` wget https://github.com/caddyserver/caddy/releases/download/v2.6.2/caddy_2.6.2_linux_amd64.tar.gz`

- Output

![4](https://user-images.githubusercontent.com/97474900/205422210-73fe5926-c0ae-41ff-bf81-0a1f2775965b.png)

2. Unzip using the following command `tar xvf caddy_2.6.2_linux_amd64.tar.gz`

![5](https://user-images.githubusercontent.com/97474900/205422253-4e29093d-f7bf-497b-8c76-c956e64d3438.png)

4. Change owner and group of the caddy file to root `sudo chown root: caddy`

![6](https://user-images.githubusercontent.com/97474900/205422283-18fffccd-351e-4e1f-b291-b761f497248f.png)

5. Copy caddy file to the bin directory `sudo cp caddy /usr/bin/`
6. Verify by cding into the path and ls to find if the file is in the right place

![7](https://user-images.githubusercontent.com/97474900/205422347-01c8ae4c-47d0-41d5-bd45-8adf9cfddb7f.png)

# Creating web app
**IMPORTANT** The following steps are to be completed in the local terminal (WSL). **DO NOT USE SERVER-ONE and SERVER-TWO.**

1. Create a new directory using `mkdir 2420-assignment-two`
2. CD into the new directory we just made and create two more directories using the same command as above `mkdir /2420-assignment-two/src/ && mkdir /2420-assignment-two/html`
3. CD into the new html directory and create a new index.html file using `vim index.html`
4. Copy and paste the following content into the index.html file

![image](https://user-images.githubusercontent.com/97474900/205422790-2f641548-d335-47ee-b573-4404c40027a4.png)

# Creating the CaddyFile
- Same as before create this in your local terminal (WSL)

1. To create the Caddyfile `vim Caddyfile`
2. Copy and paste the following content into the file

`http://<balance loader ip>{
    	root * /var/www
    	reverse_proxy /api localhost:5050
    	file_server
}
`
3. We can now move the file using `rsync -aPv -e "ssh -i ~/.ssh/<SSH_key<" <path/of/caddyfile/ <user>@64.227.110.206:<destination path>

# Installing node and volta for two droplets
- Note this command can be run anywhere to install volta
1. `curl https://get.volta.sh | bash` to begin
-Output

![Screenshot 2022-12-02 124539](https://user-images.githubusercontent.com/97474900/205423098-668af3b6-f8f5-470d-864d-978fc005061d.png)

2. Installing node `volta install node`
3. volta install npm

![Screenshot 2022-12-02 125147](https://user-images.githubusercontent.com/97474900/205423161-cb90d0f7-8129-4d9f-962d-47ce35851698.png)

- Note **This is for both servers!**

# Copying files from WSL
1.  `rsync -aPv -e "ssh -i ~/.ssh/<SSH_key>" /path/of/file/ <user>@<server ip>:<destination path>`

# Node
1. Inside the new src we created, create a new node project `npm init`.
- Note when prompt just press enter key.
-Output below

![8](https://user-images.githubusercontent.com/97474900/205425111-e140f6b8-4203-4026-84dc-9ebe7bd5f9a4.png)

2. `npm i fastify` to install fastify
- Output below

![9](https://user-images.githubusercontent.com/97474900/205425148-121e985c-3ec2-4f26-92c3-5a8b9e59307e.png)


3. CD into src directory create new node js file `vim index.js`
4. Copy and paste the following below to file

![image](https://user-images.githubusercontent.com/97474900/205424965-4a0058a6-5789-4a22-b38f-969770408dae.png)


5. Confirm you have set everything up correctly by running `node index.js`
- Output below

![10](https://user-images.githubusercontent.com/97474900/205424085-3d8bf77f-3b1f-4f9d-b7df-1b7a8dc64ed9.png)

6. In your prefered browser type the ip that was return in the output.
- Dont freak out if you get an error! if you put an "/" after the ip it will show the index.js html

# Write service files
- Note this should be done on your local terminal again (WSL)
1. create the caddy.service file by using `vim caddy.service`
2. Copy and paste the content below

![image](https://user-images.githubusercontent.com/97474900/205424451-711f2ed3-f108-4f27-82ba-5bcdc8c41530.png)

3. Use the command from the section "Copy files from WSL" to transfer the file to both servers.
4. Create another service file called hello_web.service using `vim hello_web.service`
5. Copy and paste the following content below

![image](https://user-images.githubusercontent.com/97474900/205424571-3e7bdd50-0f3e-4541-ac43-471ca0f8bdbc.png)

6. Use the same command from the section in step 3 to tranfer the file to both servers(server-one, server-two)

# Starting service files
-Note Run this for both servers!

1. Run the command `sudo systemctl daemon-reload`
2  `sudo systemctl start caddy.service`
3. `sudo systemctl enable --now caddy.service`

- Now run the commands but with the other service (hello_web.service)

4. To ensure everything is running correctly use `sudo systemctl status <service name you want to run>`

![image](https://user-images.githubusercontent.com/97474900/205424736-c2d2298c-a0a4-401b-8f46-b27f73a603f5.png)
![image](https://user-images.githubusercontent.com/97474900/205424760-1f3cb1a4-bd64-46c6-a2be-974ea2923e58.png)

# Check load balancer to ensure everything is functional
- Visit your balance loader ip `http://64.225.88.13/`

![16](https://user-images.githubusercontent.com/97474900/205424832-3f04d692-8e1d-4058-a94f-ecc760cfa557.png)

- Connect balance loader ip with "/api" at the end `http://64.225.88.13/` for server one

![14](https://user-images.githubusercontent.com/97474900/205424862-98f36ce1-f570-4d60-8708-b50db1eaad91.png)

- Connect balance loader ip with "/api" at the end `http://64.225.88.13/` for server two

![15](https://user-images.githubusercontent.com/97474900/205424877-a82e5660-a0fb-4e43-9414-cb9903613ca5.png)

**YAY you now have completed this guide!**





