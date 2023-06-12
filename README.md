## Serious Sam Classic The Nightmare Tower
![Build status](https://github.com/tx00100xt/SE1-TFE-Tower/actions/workflows/cibuild.yml/badge.svg)
[![License: GPL v2](https://img.shields.io/badge/License-GPL_v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/tx00100xt/SE1-TFE-Tower)

What is Nightmare Tower?  
This is a modification for Serious Sam Classic The First Encounter.  
The nightmare tower. A fan-made addition to the game containing three levels and released in 2001.  
It received the status of a cult as it was published on CDs in the CIS countries.  
It is based on the library from the Serious Sam++ modification from Elad 'Aircars Iirion Claus' Amir.  
This mod required https://github.com/tx00100xt/SeriousSamClassic or https://github.com/tx00100xt/SeriousSamClassic-VK to run.  
Nightmare Tower was created by fans of the game Serious Sam Classic and is distributed for free.    

Author:  
Leonid Kolesnichenko is author this mod for windows.  

![TW1](https://raw.githubusercontent.com/tx00100xt/SE1-TFE-Tower/main/Images/tower-1.png)

![TW2](https://raw.githubusercontent.com/tx00100xt/SE1-TFE-Tower/main/Images/tower-2.png)

![TW3](https://raw.githubusercontent.com/tx00100xt/SE1-TFE-Tower/main/Images/tower-3.png)


Download [SamTFE-Tower.tar.xz] archive and unpack to  SeriousSamClassic/SamTFE/ directory.  
You can also download the archive using curl or wget:
```
wget https://archive.org/download/sam-tfe-tower/SamTFE-Tower.tar.xz
```
To start the modification, use the game menu - item Modification.

Building Serious Sam Classic The Nightmare Tower modification (only for SS:TFE)
-------------------------------------------------------------------------------

### Linux

Type this in your terminal:

```
git clone https://github.com/tx00100xt/SE1-TFE-Tower.git
cd SE1-TFE-Tower/Sources
./build-linux64.sh                   	# use build-linux32.sh for 32-bits
```
After that , libraries will be collected in the Mods directory.  
Copy them to SeriousSamClassic/SamTFE/Mods/Tower/Bin folder.

### Gentoo

To build a game for gentoo, use a https://github.com/tx00100xt/serioussam-overlay containing ready-made ebuilds for building the game and add-ons.

### Arch Linux

To build a game under Arch Linux you can use the package from AUR: https://aur.archlinux.org/packages/serioussam

### Raspberry Pi

The build for raspberry pi is similar to the build for Linux, you just need to add an additional build key.

```
git clone https://github.com/tx00100xt/SE1-TFE-Tower.git
cd SE1-TFE-Tower/Sources
./build-linux64.sh -DRPI4=TRUE	        # use build-linux32.sh for 32-bits
```
### FreeBSD

Install bash. 
Type this in your terminal:

```
git clone https://github.com/tx00100xt/SE1-TFE-Tower.git
cd SE1-TFE-Tower/Sources
bash build-linux64.sh 	                # use build-linux32.sh for 32-bits
```
After that , libraries will be collected in the Mods directory.  
Copy them to SeriousSamClassic/SamTFE/Mods/Tower/Bin folder.

### macOS

Install dependes
```
brew install bison flex sdl2 libogg libvorbis zlib-ng cmake git
```
Type this in your terminal:
```
git clone https://github.com/tx00100xt/SE1-TFE-Tower.git
cd SE1-TFE-Tower/Sources
mkdir build
cd build
cmake -DCMAKE_BUILD_TYPE=Release -DTFE=TRUE ..
make -j4
make install
```
After that , libraries will be collected in the Mods directory.   
Copy them to SeriousSamClassic/SamTFE/Mods/Tower/Bin folder.

Windows
-------
* This project can be compiled starting from Windows 7 and higher.

1. Download and Install [Visual Studio 2015 Community Edition] or higher.
2. Download and Install [Windows 10 SDK 10.0.14393.795] or other.
3. Open the solution in the Sources folder, select Release x64 or Release Win32 and compile it.

Supported Architectures
----------------------
* `x86`
* `aarch64`
* `e2k` (elbrus)

Supported OS
-----------
* `Linux`
* `FreeBSD`
* `Windows`
* `Raspberry PI OS`
* `macOS`

### Build status
|CI|Platform|Compiler|Configurations|Platforms|Status|
|---|---|---|---|---|---|
|GitHub Actions|Windows, Ubuntu, FreeBSD, Alpine, Raspberry PI OS Lite, macOS|MSVC, GCC, Clang|Release|x86, x64, armv7l, aarch64, riscv64, ppc64le, s390x|![GitHub Actions Build Status](https://github.com/tx00100xt/SE1-TFE-Tower/actions/workflows/cibuild.yml/badge.svg)

You can download a the automatically build based on the latest commit.  
To do this, go to the [Actions tab], select the top workflows, and then Artifacts.

License
-------

* Serious Engine v1.10 is licensed under the GNU GPL v2 (see LICENSE file).


[SamTFE-Tower.tar.xz]: https://drive.google.com/file/d/1-29nvJBlHDq9eOy1vEWX3tlgmyFDoYZP/view?usp=sharing "Serious Sam Classic The Nightmare Tower"
[Visual Studio 2015 Community Edition]: https://go.microsoft.com/fwlink/?LinkId=615448&clcid=0x409 "Visual Studio 2015 Community Edition"
[Windows 10 SDK 10.0.14393.795]: https://go.microsoft.com/fwlink/p/?LinkId=838916 "Windows 10 SDK 10.0.14393.795"
[Actions tab]: https://github.com/tx00100xt/SE1-TFE-Tower/actions "Download Artifacts"
