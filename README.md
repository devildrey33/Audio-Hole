# Audio-Hole

AudioHole is a multichannel analizer to display audio data, for now i use 6 channels (full song, bass, drum, piano, vocals and other) to display audio data in diferent shaders.
This allows to make simple animations using individual channels data as reference.

To get 5 channels per song i used https://splitter.ai , and thats why i have : bass, drum, piano, vocals and other channels. Channel six is the original song, because some times songs can loose the sincronization, specialy in low end devices. So i have 6 songs playing at same time, 5 on mute only to get their data. 

I have more complex animations for a specific song in a certain beat per minute using gsap (at the moment only 'Kill City Kills' song is using this)

Made with Three.js, pnmdrs postprocessin, gsap, and lil.gui (for debug)

live  : https://devildrey33.es/Ejemplos/AudioHole/index.html

debug : https://devildrey33.es/Ejemplos/AudioHole/index.html#debug

![AudioHole](https://github.com/devildrey33/Audio-Hole/assets/15678544/d70af7bc-2c9b-47d1-8bf8-da0212f3175b)

