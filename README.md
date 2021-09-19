# e-paper-manager
- 電子ペーパーを用いてスマートフォンから写真を切り替えられるデジタル写真立てを作る

## 環境構築

### Raspberry Pi のセットアップ
- OS: Raspberry Pi OS(32-bit)
  - 注: Ubuntu では動かなかった

```.sh
# https://www.waveshare.com/wiki/5.65inch_e-Paper_Module_(F)

# SPI config
sudo raspi-config # Interfacing Options → SPI → yes
sudo reboot

# install libraries
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.60.tar.gz
tar zxvf bcm2835-1.60.tar.gz 
cd bcm2835-1.60/
sudo ./configure
sudo make
sudo make check
sudo make install

# install WiringPi libraries
sudo apt-get install wiringpi
wget https://project-downloads.drogon.net/wiringpi-latest.deb
sudo dpkg -i wiringpi-latest.deb
gpio -v

# install Python2 libraries
sudo apt-get update
sudo apt-get install python-pip
sudo apt-get install python-pil
sudo apt-get install python-numpy
sudo pip install RPi.GPIO
sudo pip install spidev


# install Python3 libraries
sudo apt-get update
sudo apt-get install python3-pip
sudo apt-get install python3-pil
sudo apt-get install python3-numpy
sudo pip3 install RPi.GPIO
sudo pip3 install spidev
```


### nodejs
```.sh
# https://qiita.com/seibe/items/36cef7df85fe2cefa3ea

$ sudo apt install -y nodejs npm
$ sudo npm install n -g
$ sudo n stable
$ sudo apt purge -y nodejs npm
$ exec $SHELL -l
$ node -v
```

### vue-cli
```.sh
$ sudo npm install -g vue-cli
```
