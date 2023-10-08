# Audio-Hole

AudioHole is a multichannel analizer to display audio data, for now i use 6 channels (full song, bass, drum, piano, vocals and other) to display audio data in diferent shaders.
This allows to make simple animations using individual channels data as reference.

To get 5 channels per song i used [splitter.ai](https://splitter.ai), and thats why i have : bass, drum, piano, vocals and other channels (i dont have a specific channel for guitar...). Channel six is the original song, because some times songs can loose the sincronization, specialy in low end devices. So i have 6 songs playing at same time, 5 on mute only to get their data. 

I have more complex animations for a specific song in a certain beat per minute using gsap (at the moment only 'Kill City Kills' song is using this)

Made with [Three.js](https://threejs.org/), [pnmdrs postprocessing](https://github.com/pmndrs/postprocessing) (God rays and Bloom), [gsap](https://greensock.com/gsap/), and [lil.gui](https://www.npmjs.com/package/lil-gui) (for debug)

live  : https://devildrey33.es/Ejemplos/AudioHole/index.html

debug : https://devildrey33.es/Ejemplos/AudioHole/index.html#debug

![AudioHole](https://github.com/devildrey33/Audio-Hole/assets/15678544/d70af7bc-2c9b-47d1-8bf8-da0212f3175b)

This project its like the evolution of my [Audio Playground](https://github.com/devildrey33/Audio-PlayGround)

But this is not the first time i try to animate a song... look at his prehistoric parent from 2017 : [Cyberparasit](https://devildrey33.es/Lab/Ejemplos/CyberParasit/CyberParasit.html)

